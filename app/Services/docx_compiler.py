import sys
import json
import zipfile
import re

if len(sys.argv) < 4:
    print("Usage: docx_compiler.py [json_data_path] [template_path] [output_path]")
    sys.exit(1)

json_path = sys.argv[1]
template_path = sys.argv[2]
output_path = sys.argv[3]

# Read JSON data
with open(json_path, 'r', encoding='utf-8') as f:
    request_data = json.load(f)

try:
    with zipfile.ZipFile(template_path, 'r') as zin:
        with zipfile.ZipFile(output_path, 'w') as zout:
            for item in zin.infolist():
                data = zin.read(item.filename)
                if item.filename == 'word/document.xml':
                    xml_content = data.decode('utf-8')
                    
                    # 1. Clean split placeholders (e.g. {nama_</w:t>...admin})
                    def clean_placeholders(match):
                        inner = match.group(1)
                        clean_inner = re.sub(r'<[^>]+>', '', inner)
                        return f"{{{clean_inner}}}"
                    xml_content = re.sub(r'\{([^{}]*?)\}', clean_placeholders, xml_content)
                    
                    # Replace hardcoded parts from original document
                    xml_content = xml_content.replace('dari Liman', f"dari {request_data['requester_name']}")
                    xml_content = xml_content.replace('Irawan Saputra', request_data.get('nama_penatausahaan', '........................................'))
                    xml_content = xml_content.replace('Kepala Sub Bagian Tata Usaha Unit Pengelola Rumah Susun II', request_data.get('jabatan_penatausahaan', '........................................'))
                    xml_content = xml_content.replace('Pengurus Barang Pembantu', request_data.get('jabatan_pengurus_barang', 'Pengurus Barang Pembantu'))
                    
                    # 2. Extract and duplicate table rows for all 3 tables
                    row_regex = r'<w:tr(?:(?!</w:tr>).)*?\{nama_barang\}(?:(?!</w:tr>).)*?</w:tr>'
                    rows = re.findall(row_regex, xml_content, re.DOTALL)
                    
                    if len(rows) >= 6:
                        def make_rows(template_row, items):
                            new_rows = []
                            for idx, it in enumerate(items):
                                row_xml = template_row
                                row_xml = row_xml.replace('{nama_barang}', it['name'])
                                row_xml = row_xml.replace('{qty}', f"{it['qty']} {it['unit']}")
                                row_xml = row_xml.replace('{keterangan}', request_data['notes'] if idx == 0 else '')
                                # Replace first digit number cell
                                row_xml = re.sub(r'<w:t>([0-9]+)</w:t>', f'<w:t>{idx+1}</w:t>', row_xml, count=1)
                                new_rows.append(row_xml)
                            return "".join(new_rows)
                            
                        # Replace Table 1
                        table1_pattern = rows[0] + r'(?:(?!<w:tr).)*?' + rows[1]
                        xml_content = re.sub(table1_pattern, make_rows(rows[0], request_data['items']), xml_content, flags=re.DOTALL, count=1)
                        
                        # Replace Table 2
                        rows_upd = re.findall(row_regex, xml_content, re.DOTALL)
                        if len(rows_upd) >= 4:
                            table2_pattern = rows_upd[0] + r'(?:(?!<w:tr).)*?' + rows_upd[1]
                            xml_content = re.sub(table2_pattern, make_rows(rows_upd[0], request_data['items']), xml_content, flags=re.DOTALL, count=1)
                            
                            # Replace Table 3
                            rows_upd2 = re.findall(row_regex, xml_content, re.DOTALL)
                            if len(rows_upd2) >= 2:
                                table3_pattern = rows_upd2[0] + r'(?:(?!<w:tr).)*?' + rows_upd2[1]
                                xml_content = re.sub(table3_pattern, make_rows(rows_upd2[0], request_data['items']), xml_content, flags=re.DOTALL, count=1)
                                
                    # 3. Replace general placeholders
                    replacements = {
                        '{nama_pemohon}': request_data['requester_name'],
                        '{bidang_pemohon}': request_data['requester_dept'],
                        
                        # Halaman 1 (SPB): {nama_manajer} -> Atasan Langsung
                        '{nama_manajer}': request_data['nama_atasan'],
                        '{nip_manajer}': request_data['nip'],
                        '{divisi_manajer}': request_data['jabatan_atasan'],
                        
                        # Halaman 2 (SPPB): {nama_atasan} -> Penatausaha
                        '{nama_atasan}': request_data.get('nama_penatausahaan', '........................................'),
                        '{nip_atasan}': request_data.get('nip_penatausahaan', '........................................'),
                        '{jabatan_atasan}': request_data.get('jabatan_penatausahaan', '........................................'),
                        
                        # Halaman 3 (BAST): {nama_admin} -> Pengurus Barang
                        '{nama_admin}': request_data.get('nama_pengurus_barang', '........................................'),
                        '{nip_admin}': request_data.get('nip_pengurus_barang', '........................................'),
                        '{jabatan_admin}': request_data.get('jabatan_pengurus_barang', '........................................'),
                        
                        '{tanggal, bulan, tahun}': request_data['date_formatted'],
                        '{tanggal}': request_data['tanggal'],
                        '{bulan}': request_data['bulan'],
                        '{tahun}': request_data['tahun'],
                        'Senin': request_data['day_name'],
                        'Tiga Belas': request_data['tanggal_words'],
                        'Juli': request_data['bulan'],
                        'Dua Ribu Dua Puluh Enam': request_data['tahun_words'],
                    }
                    
                    for k, v in replacements.items():
                        xml_content = xml_content.replace(k, v)
                        
                    zout.writestr(item.filename, xml_content.encode('utf-8'))
                else:
                    zout.writestr(item, data)
    print("SUCCESS")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
