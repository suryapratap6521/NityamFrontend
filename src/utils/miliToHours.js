export function calculateTime(createdAt) {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - createdDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60); // milliseconds to hours conversion
    const minuteDifference = timeDifference / (1000 * 60);

    if (minuteDifference < 60) {
        return Math.round(minuteDifference) + " minutes ago";
    }
    
    if (minuteDifference < 1) {
        return "few Seconds ago";
    }

    if (hoursDifference < 24) {
        return Math.round(hoursDifference) + " hours ago";
    } else {
        const daysDifference = Math.floor(hoursDifference / 24);
        return daysDifference + (daysDifference === 1 ? " day ago" : " days ago");
    }
}


