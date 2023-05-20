export function formatCurrency(amountInCents: number) {
    return `${(amountInCents / 100).toFixed(2)}€`;
}