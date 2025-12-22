export function checkTimeForPicketType() {
    const now = new Date();
    const jakartaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const hours = jakartaTime.getHours();
    const minutes = jakartaTime.getMinutes();

    if ((hours >= 4 && hours < 6) || (hours === 6 && minutes <= 55)) {
        return 'Piket Pagi';
    }

    if ((hours === 12 && minutes >= 30) || (hours > 12 && hours < 18) || hours === 18) {
        return 'Piket Sore';
    }

    return 'choose';
}

export function isLate(picketType) {
    const now = new Date();
    const jakartaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const hours = jakartaTime.getHours();
    const minutes = jakartaTime.getMinutes();

    if (picketType === 'Piket Pagi') {
        return hours > 6 || (hours === 6 && minutes > 55);
    }

    if (picketType === 'Piket Sore') {
        return hours > 18;
    }

    return false;
}

export function getJakartaTime() {
    const now = new Date();
    return new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
}

export function formatTimestamp(date) {
    return new Date(date).toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}
