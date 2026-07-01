<?php

namespace App\Exceptions;

class UnauthorizedException extends ApiException
{
    public function __construct(string $message = 'Unauthorized action')
    {
        parent::__construct($message, 403);
    }
}
