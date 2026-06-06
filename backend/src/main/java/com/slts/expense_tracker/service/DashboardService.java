package com.slts.expense_tracker.service;

import com.slts.expense_tracker.dto.DashboardResponse;
import com.slts.expense_tracker.dto.DashboardResponse.RecentTransaction;
import com.slts.expense_tracker.model.User;
import com.slts.expense_tracker.repository.ExpenseRepository;
import com.slts.expense_tracker.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

        /*
      Builds the dashboard summary for a given user.
      Includes:
     - Total income and expenses
     - Monthly income and expenses
     - Current balance
     - Highest expense category for the month
     - Recent transactions
     */

    public DashboardResponse getDashboard(User user, Integer month, Integer year) {
        LocalDate dateForMonth;
        if (month != null && year != null && month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
            dateForMonth = LocalDate.of(year, month, 1);
        } else {
            dateForMonth = LocalDate.now();
        }
        LocalDate startOfMonth = dateForMonth.withDayOfMonth(1);
        LocalDate endOfMonth = dateForMonth.withDayOfMonth(dateForMonth.lengthOfMonth());

        // Fetch total income & expenses
        BigDecimal totalIncome = incomeRepository.sumAmountByUser(user);
        BigDecimal totalExpenses = expenseRepository.sumAmountByUser(user);

        // Handle nulls by treating them as zero
        totalIncome = totalIncome != null ? totalIncome : BigDecimal.ZERO;
        totalExpenses = totalExpenses != null ? totalExpenses : BigDecimal.ZERO;

        // Fetch monthly income & expenses
        BigDecimal monthlyIncome = incomeRepository
                .sumAmountByUserAndMonth(user, startOfMonth, endOfMonth);
        BigDecimal monthlyExpenses = expenseRepository
                .sumAmountByUserAndMonth(user, startOfMonth, endOfMonth);
        monthlyIncome = monthlyIncome != null ? monthlyIncome : BigDecimal.ZERO;
        monthlyExpenses = monthlyExpenses != null ? monthlyExpenses : BigDecimal.ZERO;

        // Calculate balance = total income - total expenses
        BigDecimal balance = totalIncome.subtract(totalExpenses);

        // Find the highest expense category for this month
        String highestCategory = getHighestCategory(user, startOfMonth, endOfMonth);

        // Get last 5 recent transactions
        List<RecentTransaction> recent = getRecentTransactions(user);

        // Return dashboard response DTO
        return new DashboardResponse(
                totalIncome, totalExpenses, balance,
                monthlyIncome, monthlyExpenses,
                highestCategory, recent);
    }

    //  Finds the top expense category for the given month.
    private String getHighestCategory(User user, LocalDate start, LocalDate end) {
        List<Object[]> results = expenseRepository
                .findTopCategoryByUserAndMonth(user, start, end);
        if (results.isEmpty()) return "N/A";
        return results.get(0)[0].toString();
    }

    //Collects recent transactions (both income and expenses).
    private List<RecentTransaction> getRecentTransactions(User user) {
        List<RecentTransaction> transactions = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        expenseRepository.findByUserOrderByCreatedAtDesc(user)
                .forEach(e -> transactions.add(new RecentTransaction(
                        "EXPENSE", e.getTitle(),
                        e.getAmount(), e.getTransactionDate().format(fmt))));

        incomeRepository.findByUserOrderByCreatedAtDesc(user)
                .forEach(i -> transactions.add(new RecentTransaction(
                        "INCOME", i.getSource(),
                        i.getAmount(), i.getReceivedDate().format(fmt))));

        transactions.sort(Comparator.comparing(
                RecentTransaction::getDate).reversed());

        return transactions.size() > 5
                ? transactions.subList(0, 5)
                : transactions;
    }
}
