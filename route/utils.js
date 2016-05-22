exports.splitAndTrimTagString = value => {
	return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
};

exports.yyyymmdd_to_date = dateString => new Date(dateString);