package com.slts.expense_tracker.controller;

import com.slts.expense_tracker.dto.IncomeRequest;
import com.slts.expense_tracker.model.Income;
import com.slts.expense_tracker.model.User;
import com.slts.expense_tracker.service.IncomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
@RequiredArgsConstructor
public class IncomeController {

    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<Income> create(
            @Valid @RequestBody IncomeRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(incomeService.create(request, user));
    }

    @GetMapping
    public ResponseEntity<List<Income>> getAll(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(incomeService.getAllByUser(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Income> update(
            @PathVariable Long id,
            @Valid @RequestBody IncomeRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(incomeService.update(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        incomeService.delete(id, user);
        return ResponseEntity.ok("Income deleted successfully");
    }
}
