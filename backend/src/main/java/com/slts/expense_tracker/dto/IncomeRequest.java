package com.slts.expense_tracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class IncomeRequest {

    @NotBlank(message = "Source is required")
    private String source;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Received date is required")
    private LocalDate receivedDate;

    private String note;
}
