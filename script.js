document.addEventListener('DOMContentLoaded', function() {
    const toggleDarkMode = document.getElementById('toggleDarkMode');
    const submitData = document.getElementById('submitData');
    const incomeInput = document.getElementById('incomeInput');
    const incomeClassification = document.getElementById('incomeClassification');
    const expenseInput = document.getElementById('expenseInput');
    const expenseClassification = document.getElementById('expenseClassification');
    const savingsGoalInput = document.getElementById('savingsGoalInput');
    const savingsGoalClassification = document.getElementById('savingsGoalClassification');
    const incomeDisplay = document.getElementById('incomeDisplay');
    const expenseDisplay = document.getElementById('expenseDisplay');
    const savingsDisplay = document.getElementById('savingsDisplay');
    const progressBarFill = document.getElementById('progressBarFill');
    const calendarBody = document.getElementById('calendarBody');
    const addIncome = document.getElementById('addIncome');
    const addExpense = document.getElementById('addExpense');
    const addSavingsGoal = document.getElementById('addSavingsGoal');
    const incomeList = document.getElementById('incomeList');
    const expenseList = document.getElementById('expenseList');
    const savingsGoalList = document.getElementById('savingsGoalList');

    let darkMode = false;
    let incomes = [];
    let expenses = [];
    let savingsGoals = [];

    toggleDarkMode.addEventListener('click', () => {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode');
        updateHeaderFooterColors();
    });

    function updateHeaderFooterColors() {
        const header = document.querySelector('.main-header');
        const footer = document.querySelector('.main-footer');
        if (darkMode) {
            header.style.backgroundColor = '#2c3e50';
            footer.style.backgroundColor = '#34495e';
        } else {
            header.style.backgroundColor = '';
            footer.style.backgroundColor = '';
        }
    }

    function updateDisplay() {
        const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalSavingsGoal = savingsGoals.reduce((sum, goal) => sum + goal.amount, 0);

        incomeDisplay.textContent = `Total: ₱${totalIncome.toFixed(2)}`;
        expenseDisplay.textContent = `Total: ₱${totalExpenses.toFixed(2)}`;

        const savings = totalIncome - totalExpenses;
        const savingsProgress = totalSavingsGoal ? (savings / totalSavingsGoal) * 100 : 0;
        const clampedProgress = Math.max(0, Math.min(100, savingsProgress));

        savingsDisplay.textContent = `Progress: ${clampedProgress.toFixed(2)}%`;
        progressBarFill.style.width = `${clampedProgress}%`;
    }

    function addItem(list, items, input, classification) {
        const amount = Math.floor(parseFloat(input.value));
        const classificationText = classification.value.trim();
        if (!isNaN(amount) && amount > 0 && classificationText) {
            items.push({ amount, classification: classificationText });
            const li = document.createElement('li');
            li.innerHTML = `
                ₱${amount.toFixed(2)} - ${classificationText}
                <button class="delete-btn">Delete</button>
            `;
            li.querySelector('.delete-btn').addEventListener('click', () => {
                list.removeChild(li);
                items.splice(items.findIndex(item => item.amount === amount && item.classification === classificationText), 1);
                updateDisplay();
            });
            list.appendChild(li);
            input.value = '';
            classification.value = '';
            updateDisplay();
        }
    }

    addIncome.addEventListener('click', () => addItem(incomeList, incomes, incomeInput, incomeClassification));
    addExpense.addEventListener('click', () => addItem(expenseList, expenses, expenseInput, expenseClassification));
    addSavingsGoal.addEventListener('click', () => addItem(savingsGoalList, savingsGoals, savingsGoalInput, savingsGoalClassification));

    function forceInteger(input) {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 0) {
                this.value = parseInt(this.value, 10);
            }
        });
    }

    forceInteger(incomeInput);
    forceInteger(expenseInput);
    forceInteger(savingsGoalInput);

    submitData.addEventListener('click', () => {
        const currentDate = new Date().toLocaleDateString();
        const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalSavingsGoal = savingsGoals.reduce((sum, goal) => sum + goal.amount, 0);
        const savings = totalIncome - totalExpenses;
        const progress = totalSavingsGoal ? ((savings / totalSavingsGoal) * 100).toFixed(2) : '0.00';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${currentDate}</td>
            <td>₱${totalIncome.toFixed(2)}</td>
            <td>₱${totalExpenses.toFixed(2)}</td>
            <td>₱${savings.toFixed(2)}</td>
            <td>${progress}%</td>
            <td>
                <strong>Income:</strong> ${incomes.map(i => `${i.classification}`).join(', ')}<br>
                <strong>Expenses:</strong> ${expenses.map(e => `${e.classification}`).join(', ')}<br>
                <strong>Savings Goals:</strong> ${savingsGoals.map(s => `${s.classification}`).join(', ')}
            </td>
        `;
        calendarBody.appendChild(row);

        // Reset lists and update display
        incomes = [];
        expenses = [];
        savingsGoals = [];
        incomeList.innerHTML = '';
        expenseList.innerHTML = '';
        savingsGoalList.innerHTML = '';
        updateDisplay();
    });
});

