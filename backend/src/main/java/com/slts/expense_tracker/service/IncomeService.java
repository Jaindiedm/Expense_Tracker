package com.slts.expense_tracker.service;

import com.slts.expense_tracker.dto.IncomeRequest;
import com.slts.expense_tracker.model.Income;
import com.slts.expense_tracker.model.User;
import com.slts.expense_tracker.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final IncomeRepository incomeRepository;

    /*Creates a new income record for the given user.
     - Maps fields from IncomeRequest DTO to Income entity
     - Associates the income with the user
     - Saves it in the database
     */
    public Income create(IncomeRequest request, User user) {
        Income income = new Income();
        income.setUser(user);
        income.setSource(request.getSource());
        income.setAmount(request.getAmount());
        income.setReceivedDate(request.getReceivedDate());
        income.setNote(request.getNote());
        return incomeRepository.save(income);
    }

    //Retrieves all income records for a given user.
    public List<Income> getAllByUser(User user) {
        return incomeRepository.findByUserOrderByCreatedAtDesc(user);
    }

    //Updates an existing income record.
    public Income update(Long id, IncomeRequest request, User user) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        if (!income.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        // Update fields
        income.setSource(request.getSource());
        income.setAmount(request.getAmount());
        income.setReceivedDate(request.getReceivedDate());
        income.setNote(request.getNote());
        return incomeRepository.save(income);
    }

    // Deletes an income record.
    public void delete(Long id, User user) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        if (!income.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        incomeRepository.delete(income);
    }
}