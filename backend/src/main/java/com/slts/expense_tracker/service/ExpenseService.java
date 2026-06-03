package com.slts.expense_tracker.service;

import com.slts.expense_tracker.dto.ExpenseRequest;
import com.slts.expense_tracker.model.Expense;
import com.slts.expense_tracker.model.User;
import com.slts.expense_tracker.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    /*
    Creates a new expense for the given user.
     - Maps fields from ExpenseRequest DTO to Expense entity
     - Associates the expense with the user
     - Saves it in the database
     */
    public Expense create(ExpenseRequest request, User user) {
        Expense expense = new Expense();
        expense.setUser(user); // Link expense to the logged-in user
        expense.setTitle(request.getTitle());
        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setTransactionDate(request.getTransactionDate());
        expense.setNote(request.getNote());
        return expenseRepository.save(expense); // Persist to DB
    }

    // Retrieves all expenses for a given user.
    public List<Expense> getAllByUser(User user) {
        return expenseRepository.findByUserOrderByCreatedAtDesc(user);
    }

    /*
    Updates an existing expense.
     - Finds expense by ID
     - Ensures the expense belongs to the logged-in user (authorization check)
     - Updates fields with new values from request
     - Saves updated expense in database
     */
    public Expense update(Long id, ExpenseRequest request, User user) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        // Prevent unauthorized updates
        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        // Update fields
        expense.setTitle(request.getTitle());
        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setTransactionDate(request.getTransactionDate());
        expense.setNote(request.getNote());
        return expenseRepository.save(expense);
    }

    // Deletes an expense by ID after verifying ownership.
    public void delete(Long id, User user) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        expenseRepository.delete(expense);
    }
}
