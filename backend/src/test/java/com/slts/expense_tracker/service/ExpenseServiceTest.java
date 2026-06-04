
package com.slts.expense_tracker.service;

import com.slts.expense_tracker.dto.ExpenseRequest;
import com.slts.expense_tracker.model.Expense;
import com.slts.expense_tracker.model.Expense.Category;
import com.slts.expense_tracker.model.User;
import com.slts.expense_tracker.repository.ExpenseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @InjectMocks
    private ExpenseService expenseService;

    private User testUser;
    private Expense testExpense;
    private ExpenseRequest expenseRequest;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Test User");
        testUser.setEmail("test@test.com");

        // Create test expense
        testExpense = new Expense();
        testExpense.setId(1L);
        testExpense.setUser(testUser);
        testExpense.setTitle("Lunch");
        testExpense.setCategory(Category.FOOD);
        testExpense.setAmount(new BigDecimal("500.00"));
        testExpense.setTransactionDate(LocalDate.now());

        // Create expense request
        expenseRequest = new ExpenseRequest();
        expenseRequest.setTitle("Lunch");
        expenseRequest.setCategory(Category.FOOD);
        expenseRequest.setAmount(new BigDecimal("500.00"));
        expenseRequest.setTransactionDate(LocalDate.now());
        expenseRequest.setNote("Test note");
    }

    @Test
    void create_ShouldSaveAndReturnExpense() {
        // ARRANGE
        when(expenseRepository.save(any(Expense.class))).thenReturn(testExpense);

        // ACT
        Expense result = expenseService.create(expenseRequest, testUser);

        // ASSERT
        assertNotNull(result);
        assertEquals("Lunch", result.getTitle());
        verify(expenseRepository, times(1)).save(any(Expense.class));
    }

    @Test
    void getAllByUser_ShouldReturnUserExpenses() {
        // ARRANGE
        when(expenseRepository.findByUserOrderByCreatedAtDesc(testUser))
                .thenReturn(List.of(testExpense));

        // ACT
        List<Expense> result = expenseService.getAllByUser(testUser);

        // ASSERT
        assertEquals(1, result.size());
        assertEquals("Lunch", result.get(0).getTitle());
    }

    @Test
    void delete_ShouldThrowException_WhenExpenseNotOwned() {
        // ARRANGE — create different user
        User otherUser = new User();
        otherUser.setId(2L);

        when(expenseRepository.findById(1L)).thenReturn(Optional.of(testExpense));

        // ACT + ASSERT — other user tries to delete testUser's expense
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> expenseService.delete(1L, otherUser));

        assertEquals("Unauthorized", ex.getMessage());
        // Delete should never be called
        verify(expenseRepository, never()).delete(any());
    }

    @Test
    void delete_ShouldDelete_WhenOwnerRequests() {
        // ARRANGE
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(testExpense));

        // ACT
        expenseService.delete(1L, testUser);

        // ASSERT — verify delete was called
        verify(expenseRepository, times(1)).delete(testExpense);
    }
}