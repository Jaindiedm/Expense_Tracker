package com.slts.expense_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal balance;
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpenses;
    private String highestExpenseCategory;
    private List<RecentTransaction> recentTransactions;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RecentTransaction {
        private String type;
        private String title;
        private BigDecimal amount;
        private String date;
    }
}
