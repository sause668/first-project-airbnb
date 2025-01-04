export const formatDate = (date) => {
    const dateArr = date.split('-');
    const year = dateArr.shift().slice(2, 4);
    dateArr.push(year)
    return dateArr.join('/')
}

export const convertDate = (date) => {
    let month = date.slice(5,7);
    const year = date.slice(0,4);
    switch (month) {
        case '01':
            month = 'January';
            break;
        case '02':
            month = 'February';
            break;
        case '03':
            month = 'March';
            break;
        case '04':
            month = 'April';
            break;
        case '05':
            month = 'May';
            break;
        case '06':
            month = 'June';
            break;
        case '07':
            month = 'July';
            break;
        case '08':
            month = 'August';
            break;
        case '09':
            month = 'September';
            break;
        case '10':
            month = 'October';
            break;
        case '11':
            month = 'November';
            break;
        case '12':
            month = 'December';
            break;
        
        default:
            break;
    }
    return `${month}, ${year}`;
}