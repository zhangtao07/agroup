var dateFormat = require('dateformat');

function getDateDiff(date) {
	var now = new Date();
	var formate = "yyyy-mm-dd HH:MM";
	if (now.getDate() == date.getDate()) {

		formate = "HH:MM"
	}else if(now.getFullYear() == date.getFullYear()) {
		formate = "mm-dd HH:MM";
	}
	return dateFormat(date,formate);
}

module.exports = getDateDiff; 