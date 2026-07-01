<?php

namespace App\Exceptions;

class BusinessLogicException extends ApiException
{
    public function __construct(string $message, int $statusCode = 422)
    {
        parent::__construct($message, $statusCode);
    }
}
