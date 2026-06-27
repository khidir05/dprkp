<?php

test('returns a redirect to login when guest', function () {
    $response = $this->get(route('home'));

    $response->assertRedirect(route('login'));
});