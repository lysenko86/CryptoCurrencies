$.get('https://api.exmo.com/v1/ticker/', {}, function(data){
    if (!data['BTC_USD']){
        console.log(data.error);
    }
    for (let i=0; i<deposit.length; i++){
        if (deposit[i].sum === 0){
            continue;
        }
        const item = deposit[i];
        const currencySum = item.sum;
        const priceIn = item.priceIn;
        const priceInSum = currencySum * priceIn;
        const priceNow = item.priceNow ? item.priceNow : (data[key] && data[key].last_trade ? data[key].last_trade : 'error');
        const priceNowSum = currencySum * priceNow;
        const increaseSum = priceNowSum - priceInSum;
        const increaseSumOut = priceNowSum - priceInSum;
        const increasePercent = parseFloat(currencySum) === 0 ? 0 : Math.round(increaseSum * 100 / priceInSum / 100 * 10000) / 100;
        const priceMax = item.priceMax;
        const priceMaxSum = currencySum * priceMax;
        totalSumIn += priceInSum;
        totalSumNow += priceNowSum;
        totalSumMax += priceMaxSum;
    }
    const totalIncreaseSum = totalSumNow - totalSumIn;
    const totalIncreasePercent = Math.round(totalIncreaseSum * 100 / totalSumIn / 100 * 10000) / 100;
    $('.table-currencies tfoot').append($('<tr/>')
        .append($('<td/>', {text: 'Загалом:', class: 'col-name'}))
        .append($('<td/>', {class: 'col-sum'}))
        .append($('<td/>', {class: 'col-price-in'}))
        .append($('<td/>', {text: roundPrice(totalSumIn) + '$', class: 'col-sum-in'}))
        .append($('<td/>', {class: 'col-price-now'}))
        .append($('<td/>', {text: roundPrice(totalSumNow) + '$', class: 'col-sum-now'}))
        .append($('<td/>', {text: roundPrice(totalIncreaseSum) + '$', class: 'col-increase-now ' + (totalIncreaseSum >= 0 ? 'colorPlus' : 'colorMinus')}))
        .append($('<td/>', {text: roundPrice(totalIncreasePercent) + '%', class: 'col-increase-now-percent ' + (totalIncreasePercent >= 0 ? 'colorPlus' : 'colorMinus')}))
        .append($('<td/>', {text: roundPrice(totalSumMax) + '$', class: 'col-price-max'}))
        .append($('<td/>', {class: 'col-price-out'}))
        .append($('<td/>', {text: roundPrice(totalSumNow) + '$', class: 'col-sum-out'}))
        .append($('<td/>', {text: roundPrice(totalIncreasePercent) + '%', class: 'col-increase-out-percent'}))
        .append($('<td/>', {class: 'col-scrollbar'}))
    );
});

$(function(){
    $('.table-currencies').on('keyup', '.priceOut', function(){
        const $tr = $(this).closest('tr');
        const currencySum = $tr.find('td.col-sum').text();
        const price = $(this).val();
        const totalSum = roundPrice(price * currencySum);
        const priceInSum = $tr.find('td.col-sum-in').text().replace('$', '');
        const increaseSum = totalSum - priceInSum;
        const totalPercent = parseFloat(currencySum) === 0 ? 0 : Math.round(increaseSum * 100 / priceInSum / 100 * 10000) / 100;
        $tr.find('td.col-sum-out').text(totalSum + '$');
        $tr.find('td.col-increase-out-percent').text(totalPercent + '%');
        let totalSumOut = 0;
        $(this).closest('tbody').find('tr').each(function(){
            const outSum = $(this).find('td.col-sum-out').text().replace('$', '');
            totalSumOut += parseFloat(outSum);
        });
        totalSumOut = roundPrice(totalSumOut);
        const totalInSum = $('.table-currencies tfoot td.col-sum-in').text().replace('$', '');
        const totalIncreaseSum = totalSumOut - totalInSum;
        const totalPercentOut = totalSumOut === 0 ? 0 : Math.round(totalIncreaseSum * 100 / totalInSum / 100 * 10000) / 100;
        $('.table-currencies tfoot td.col-sum-out').text(totalSumOut + '$');
        $('.table-currencies tfoot td.col-increase-out-percent').text(totalPercentOut + '%');
    });
});