document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");
    const submitButton = expenseForm.querySelector("button[type='submit']");

    let expenses = []; 
    let isEditing = false; 
    let editingExpenseId = null; 

    // Add or update expense on form submission
    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;

        // Validate form inputs
        if (!name || isNaN(amount) || amount <= 0 || !category || !date) {
            alert("Please fill out all fields with valid data.");
            return;
        }

        if (isEditing) {
            // Update the expense being edited
            const index = expenses.findIndex((expense) => expense.id === editingExpenseId);
            if (index !== -1) {
                expenses[index] = { id: editingExpenseId, name, amount, category, date };
            }

            isEditing = false; // Reset edit mode
            editingExpenseId = null;
            submitButton.textContent = "Add Expense"; 
        } else {
           
            const expense = {
                id: Date.now(),
                name,
                amount,
                category,
                date,
            };

            expenses.push(expense);
        }

        displayExpenses(expenses);
        updateTotalAmount();

        expenseForm.reset(); // Clear form
    });

    // Handle edit and delete actions
    expenseList.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);

        if (e.target.classList.contains("delete-btn")) {
           
            expenses = expenses.filter((expense) => expense.id !== id);
            displayExpenses(expenses);
            updateTotalAmount();
        }

        if (e.target.classList.contains("edit-btn")) {
            const expense = expenses.find((expense) => expense.id === id);

            if (expense) {
                document.getElementById("expense-name").value = expense.name;
                document.getElementById("expense-amount").value = expense.amount;
                document.getElementById("expense-category").value = expense.category;
                document.getElementById("expense-date").value = expense.date;

                isEditing = true;
                editingExpenseId = id; 
                submitButton.textContent = "Update Expense"; 
            }
        }
    });
    filterCategory.addEventListener("change", (e) => {
        const category = e.target.value;
        if (category === "All") {
            displayExpenses(expenses);
        } else {
            const filteredExpenses = expenses.filter((expense) => expense.category === category);
            displayExpenses(filteredExpenses);
        }
    });

    // Function to display expenses in the table
    function displayExpenses(expenses) {
        expenseList.innerHTML = "";
        expenses.forEach((expense) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `;

            expenseList.appendChild(row);
        });
    }

    // Function to update total income, expenses, and net income
    function updateTotalAmount() {
        const totalIncome = expenses
            .filter(expense => expense.category === "Income") 
            .reduce((sum, expense) => sum + expense.amount, 0);
    
        const totalExpenses = expenses
            .filter(expense => expense.category !== "Income") 
            .reduce((sum, expense) => sum + expense.amount, 0);
    
        const netIncome = totalIncome - totalExpenses;
    
        // Update the Total Amount Display
        totalAmount.innerHTML = `
            <div><strong>Total Income:</strong> $${totalIncome.toFixed(2)}</div>
            <div><strong>Total Expenses:</strong> $${totalExpenses.toFixed(2)}</div>
            <div><strong>Net Income:</strong> $${netIncome.toFixed(2)}</div>`;
    }
});









