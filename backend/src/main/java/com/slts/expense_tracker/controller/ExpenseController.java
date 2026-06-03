package com.slts.expense_tracker.controller;

import com.slts.expense_tracker.dto.ExpenseRequest;
import com.slts.expense_tracker.model.Expense;
import com.slts.expense_tracker.model.User;
import com.slts.expense_tracker.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<Expense> create(
            @Valid @RequestBody ExpenseRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(expenseService.create(request, user));
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAll(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(expenseService.getAllByUser(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> update(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(expenseService.update(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        expenseService.delete(id, user);
        return ResponseEntity.ok("Expense deleted successfully");
    }
}