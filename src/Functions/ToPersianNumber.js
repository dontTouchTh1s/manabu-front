export default function toPersianNumber(numbers, isPrice = false) {
    if (isPrice) {
        numbers = parseInt(numbers);
        const formatter = new Intl.NumberFormat('fa-IR', {
            style: 'currency',
            currency: 'IRR',
        });

        numbers = formatter.format(numbers).replace('ریال', '');
    }

    numbers = numbers.toString();
    const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return numbers.replace(/[0-9]/g, function (w) {
        return id[+w]
    });
}

