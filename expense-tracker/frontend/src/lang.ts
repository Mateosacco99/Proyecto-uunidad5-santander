import { add } from "date-fns";

export type Lang = 'en' | 'es';

export const translations = {
  en: {
    // General
    dashboard: 'Dashboard',
    expenses: 'Expenses',
    expense: 'Expense',
    incomes: 'Income',
    income: 'Income',
    cancel: 'Cancel',
    delete: 'Delete',
    amount: 'Amount',
    description: 'Description',
    category: 'Category',
    date: 'Date',
    add_transaction: 'Add Transaction',
    logout: 'Logout',
    welcome: 'Welcome to Expense Tracker!',

    // Dashboard
    total_income: 'Total Income',
    total_expenses: 'Total Expenses',
    loading_dashboard: 'Loading dashboard...',
    dashboard_error: 'Failed to load dashboard data',
    no_data: 'No data available',

    // Income
    loading_income: 'Loading income...',
    failed_to_load_income: 'Failed to load income',
    income_error: 'Error adding income',
    add_income: 'Add Income',
    no_income: 'No income recorded yet',
    start_tracking_income: 'Start tracking your income by adding your first entry',
    delete_income: 'Are you sure you want to delete this income?',
    delete_income_error: 'Error deleting income',

    // Expenses
    loading_expense: 'Loading expenses...',
    failed_to_load_expense: 'Failed to load expenses',
    expense_error: 'Error adding expense',
    add_expense: 'Add Expense',
    no_expense: 'No expenses recorded yet',
    start_tracking_expense: 'Start tracking your expenses by adding your first entry',
    delete_expense: 'Are you sure you want to delete this expense?',
    delete_expense_error: 'Error deleting expense',

    // Transaction Form
    ammount_greater_than_zero: 'Amount must be greater than zero',
    description_required: 'Description is required',
    category_required: 'Category is required',
    date_required: 'Date is required',
    select_a_category: 'Select a category',
    enter_transaction_description: 'Enter transaction description...',
  },
  es: {
    // General
    dashboard: 'Tablero',
    expenses: 'Gastos',
    expense: 'Gasto',
    income: 'Ingreso',
    incomes: 'Ingresos',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    amount: 'Monto',
    description: 'Descripción',
    category: 'Categoría',
    date: 'Fecha',
    add_transaction: 'Agregar Transacción',
    logout: 'Cerrar sesión',
    welcome: '¡Bienvenido a Expense Tracker!',

    // Dashboard
    total_income: 'Ingresos Totales',
    total_expenses: 'Gastos Totales',
    loading_dashboard: 'Cargando tablero...',
    dashboard_error: 'Error al cargar los datos del tablero',
    no_data: 'No hay datos disponibles',

    // Income
    loading_income: 'Cargando ingresos...',
    failed_to_load_income: 'Error al cargar los ingresos',
    income_error: 'Error al agregar ingresos',
    add_income: 'Agregar Ingreso',
    no_income: 'No hay ingresos registrados aún',
    start_tracking_income: 'Comienza a registrar tus ingresos agregando tu primer ingreso',
    delete_income: 'Estás seguro de que deseas eliminar este ingreso?',
    delete_income_error: 'Error al eliminar el ingreso',

    // Expenses
    loading_expense: 'Cargando gastos...',
    failed_to_load_expense: 'Error al cargar los gastos',
    expense_error: 'Error al agregar gastos',
    add_expense: 'Agregar Gasto',
    no_expense: 'No hay gastos registrados aún',
    start_tracking_expense: 'Comienza a registrar tus gastos agregando tu primer gasto',
    delete_expense: 'Estás seguro de que deseas eliminar este gasto?',
    delete_expense_error: 'Error al eliminar el gasto',

    // Transaction Form
    ammount_greater_than_zero: 'El monto debe ser mayor que cero',
    description_required: 'La descripción es obligatoria',
    category_required: 'La categoría es obligatoria',
    date_required: 'La fecha es obligatoria',
    select_a_category: 'Selecciona una categoría',
    enter_transaction_description: 'Ingresa la descripción de la transacción...',
  }
};
