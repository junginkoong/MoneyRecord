function organizeChartData(rows) {
    var date_list, data_list, temp_date;
    var all_data = {};
    for(let i=0; i < rows.length; i++){
        temp_date = rows[i].date.toISOString().split('T')[0];
        if(!Object.keys(all_data).includes(temp_date)){
            all_data[temp_date] = 0;
        }
        all_data[temp_date] += parseFloat(rows[i].amount);
    }
    var items = Object.keys(all_data).map(function(key) {
        return [key, all_data[key]];
    });
    items.sort(function(a, b) {
        a = a[0].split('-').join('');
        b = b[0].split('-').join('');
        return a > b ? 1 : a < b ? -1 : 0;
    });
    date_list = items.map(function(element) {
        return element[0]
    });
    data_list = items.map(function(element) {
        return element[1]
    });
    return [date_list, data_list];
}

function organizeFriendData(rows, friend_rows){
    var date_list, temp_date;
    var data_list =[];
    var overall = {};
    var friend_data = {};
    var friend_index= {};

    // Initialize data (friend)
    for (let i=0; i< friend_rows.length; i++){
        friend_data[friend_rows[i].name] = null;
        data_list.push([]);
        friend_index[friend_rows[i].name] = i;
    }

    // set the amount for each friend, for each date
    for(let i=0; i < rows.length; i++){ 
        temp_date = rows[i].date.toISOString().split('T')[0];
        if(!Object.keys(overall).includes(temp_date)){
            overall[temp_date] = {...friend_data};
        }
        if(overall[temp_date][rows[i].name] == null){
            overall[temp_date][rows[i].name] = 0;
        }
        overall[temp_date][rows[i].name] +=  parseFloat(rows[i].amount);
    }

    // turn dictionary into array
    var items = Object.keys(overall).map(function(key) {
        return [key, overall[key]];
    });

    // sory array by date
    items.sort(function(a, b) {
        a = a[0].split('-').join('');
        b = b[0].split('-').join('');
        return a > b ? 1 : a < b ? -1 : 0;
    });

    // extract dates
    date_list = items.map(function(element) {
        return element[0]
    });

    // Re-organize data
    for(let i=0; i< items.length; i++){
        for(const key of Object.keys(items[i][1])){
            data_list[friend_index[key]].push(items[i][1][key]);
        }
    }

    return [date_list, data_list];
}

function getFriendName(rows){
    var output = [];
    for(let i=0; i<rows.length;i++){
        output.push(rows[i].name);
    }
    return output;
}

function getGroupRecordSummary(amount, payee, select2, friend_length, tip){
    var spent = {};
    let len, temp_amount, name;
    let select_index = 0;
    const tax = 1.13;
    tip = 1 + (parseFloat(tip) / 100);
    for(let i=0; i< friend_length.length; i++){
        // divide amount between people involved
        len = parseInt(friend_length[i]);
        temp_amount = parseFloat((parseFloat(amount[i]) * tax * tip / len).toFixed(2));
        for(let j=0; j< len; j++){
            name = select2[select_index].split(",")[1];
            if(!(name in spent)){
                spent[name] = 0;
            }
            spent[name] += temp_amount;
            select_index++;
        }

        // subtract the amount a person paid
        if(!(payee[i] in spent)){
            spent[payee[i]] = 0;
        }
        spent[payee[i]] -= (parseFloat(amount[i]) * tax * tip).toFixed(2);
    }
    return spent;
}

function multiselectHelper(friend){
    // Set up multiselect data
    if (!Array.isArray(friend)){
        if (friend == ""){
            friend = [];
        } else {
            friend = [friend];
        }
    }
    return friend
}

module.exports = {
    organizeChartData: organizeChartData,
    organizeFriendData: organizeFriendData,
    getFriendName: getFriendName,
    getGroupRecordSummary: getGroupRecordSummary,
    multiselectHelper: multiselectHelper,
};