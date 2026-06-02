package com.slts.expense_tracker.repository;

import com.slts.expense_tracker.model.Income;
import com.slts.expense_tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUserOrderByCreatedAtDesc(User user);

    List<Income> findByUserAndReceivedDateBetweenOrderByCreatedAtDesc(
        User user, LocalDate start, LocalDate end);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user = :user")
    BigDecimal sumAmountByUser(User user);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user = :user " +
           "AND i.receivedDate BETWEEN :start AND :end")
    BigDecimal sumAmountByUserAndMonth(User user, LocalDate start, LocalDate end);
}