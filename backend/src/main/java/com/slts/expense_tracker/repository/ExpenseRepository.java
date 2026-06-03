package com.slts.expense_tracker.repository;

import com.slts.expense_tracker.model.Expense;
import com.slts.expense_tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserOrderByCreatedAtDesc(User user);
    
    List<Expense> findByUserAndTransactionDateBetweenOrderByCreatedAtDesc(
        User user, LocalDate start, LocalDate end);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user = :user")
    BigDecimal sumAmountByUser(User user);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user = :user " +
           "AND e.transactionDate BETWEEN :start AND :end")
    BigDecimal sumAmountByUserAndMonth(User user, LocalDate start, LocalDate end);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.user = :user " +
           "AND e.transactionDate BETWEEN :start AND :end " +
           "GROUP BY e.category ORDER BY SUM(e.amount) DESC")
    List<Object[]> findTopCategoryByUserAndMonth(User user, LocalDate start, LocalDate end);
}
