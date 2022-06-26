function organizeChartData(rows) {
    var date_list;
    var data_list;
    var temp_date;
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

function organizeFriendData(rows, friend_rows){ // data amount, friend name, date [date, {friend: data ...}]
    //we want to {date: [], name: [data], name1: [data], ...}
    var date_list;
    var data_list =[];
    var overall = {};
    var friend_data = {};
    var friend_index= {};
    for (let i=0; i< friend_rows.length; i++){
        friend_data[friend_rows[i].name] = null;
        data_list.push([]);
        friend_index[friend_rows[i].name] = i;
    } // {name: null ...}
    var temp_date;
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
    console.log(overall);
    var items = Object.keys(overall).map(function(key) {
        return [key, overall[key]];
    }); //[date, {name:amount}...]
    items.sort(function(a, b) {
        a = a[0].split('-').join('');
        b = b[0].split('-').join('');
        return a > b ? 1 : a < b ? -1 : 0;
    });
    console.log(items);
    date_list = items.map(function(element) {
        return element[0]
    });
    for(let i=0; i< items.length; i++){
        for(const key of Object.keys(items[i][1])){
            data_list[friend_index[key]].push(items[i][1][key]);
        }
    }
    console.log(date_list);
    console.log(data_list);
    return [date_list, data_list];
}

function getFriendName(rows){
    var output = [];
    for(let i=0; i<rows.length;i++){
        output.push(rows[i].name);
    }
    return output;
}

module.exports = {
    organizeChartData: organizeChartData,
    organizeFriendData: organizeFriendData,
    getFriendName: getFriendName,
};