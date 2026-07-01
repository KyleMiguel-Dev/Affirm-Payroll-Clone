<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class StructuredLoggingService
{
    /**
     * Log user action with context
     */
    public static function logAction(
        string $action,
        string $entity,
        int $entityId,
        array $context = []
    ): void {
        Log::info("User action: {$action}", [
            'action' => $action,
            'entity' => $entity,
            'entity_id' => $entityId,
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'timestamp' => now(),
            'context' => $context,
        ]);
    }

    /**
     * Log business operation
     */
    public static function logOperation(
        string $operation,
        string $status,
        array $data = []
    ): void {
        $level = $status === 'success' ? 'info' : 'warning';

        Log::channel('operations')->{$level}("Operation: {$operation}", [
            'operation' => $operation,
            'status' => $status,
            'user_id' => auth()->id(),
            'timestamp' => now(),
            'data' => $data,
        ]);
    }

    /**
     * Log financial transaction
     */
    public static function logTransaction(
        string $type,
        float $amount,
        string $payrollPeriodId,
        array $details = []
    ): void {
        Log::channel('transactions')->info("Transaction: {$type}", [
            'type' => $type,
            'amount' => $amount,
            'payroll_period_id' => $payrollPeriodId,
            'user_id' => auth()->id(),
            'timestamp' => now(),
            'details' => $details,
        ]);
    }

    /**
     * Log payroll processing event
     */
    public static function logPayrollEvent(
        string $event,
        string $payrollPeriodId,
        array $data = []
    ): void {
        Log::channel('payroll')->info("Payroll event: {$event}", [
            'event' => $event,
            'payroll_period_id' => $payrollPeriodId,
            'user_id' => auth()->id(),
            'timestamp' => now(),
            'data' => $data,
        ]);
    }

    /**
     * Log security event
     */
    public static function logSecurityEvent(
        string $event,
        string $severity,
        array $context = []
    ): void {
        Log::channel('security')->warning("Security event: {$event}", [
            'event' => $event,
            'severity' => $severity,
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'timestamp' => now(),
            'context' => $context,
        ]);
    }

    /**
     * Log audit trail
     */
    public static function logAudit(
        string $action,
        string $modelType,
        int $modelId,
        array $oldValues = [],
        array $newValues = []
    ): void {
        Log::channel('audit')->info("Audit: {$action}", [
            'action' => $action,
            'model_type' => $modelType,
            'model_id' => $modelId,
            'user_id' => auth()->id(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'timestamp' => now(),
        ]);
    }
}
