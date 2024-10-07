// Function to populate searchable dropdowns with default values (USD and BDT)
function populateDropdown(currencies, dropdownId, defaultCurrency) {
    const dropdownList = document.getElementById(dropdownId);
    dropdownList.innerHTML = '';  // Clear the existing options

    // Default currency option
    let defaultOption = document.createElement('div');
    defaultOption.textContent = defaultCurrency;
    defaultOption.addEventListener('click', function() {
        document.getElementById(dropdownId.replace('_list', '_search')).value = defaultCurrency;
        dropdownList.style.display = 'none';  // Hide dropdown after selection
        updateAmountPlaceholder();  // Update the amount placeholder when currency is selected
    });
    dropdownList.appendChild(defaultOption);

    // Other currency options
    currencies.forEach(currency => {
        if (currency !== defaultCurrency) {
            let option = document.createElement('div');
            option.textContent = currency;
            option.addEventListener('click', function() {
                document.getElementById(dropdownId.replace('_list', '_search')).value = currency;
                dropdownList.style.display = 'none';  // Hide dropdown after selection
                updateAmountPlaceholder();  // Update the amount placeholder when currency is selected
            });
            dropdownList.appendChild(option);
        }
    });
}

// Function to update the amount input placeholder based on selected 'from currency'
function updateAmountPlaceholder() {
    let fromCurrency = document.getElementById('from_currency_search').value;
    document.getElementById('amount').placeholder = `Enter amount in ${fromCurrency}`;
}

// Currency search filter function
function filterDropdown(searchId, dropdownId) {
    const searchValue = document.getElementById(searchId).value.toLowerCase();
    const dropdownList = document.getElementById(dropdownId);

    dropdownList.style.display = 'block';  // Show dropdown when typing

    let filteredCurrencies = allCurrencies.filter(currency => currency.toLowerCase().includes(searchValue));
    
    populateDropdown(filteredCurrencies, dropdownId, document.getElementById(searchId).value);
}

// Load available currencies using API
fetch('https://open.er-api.com/v6/latest/USD')
    .then(response => response.json())
    .then(data => {
        allCurrencies = Object.keys(data.rates);
        // Populate dropdowns with default USD and BDT
        document.getElementById('from_currency_search').value = 'USD';
        document.getElementById('to_currency_search').value = 'BDT';
        populateDropdown(allCurrencies, 'from_currency_list', 'USD');
        populateDropdown(allCurrencies, 'to_currency_list', 'BDT');
        updateAmountPlaceholder();  // Set initial placeholder as 'USD'
    })
    .catch(error => console.error('Error loading currencies:', error));

// Currency conversion function
document.getElementById('convert_btn').addEventListener('click', function() {
    let amount = document.getElementById('amount').value;
    let fromCurrency = document.getElementById('from_currency_search').value;
    let toCurrency = document.getElementById('to_currency_search').value;

    if (amount === '' || isNaN(amount) || fromCurrency === '' || toCurrency === '') {
        document.getElementById('result').innerHTML = "Please enter valid data.";
        return;
    }

    fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`)
        .then(response => response.json())
        .then(data => {
            let rate = data.rates[toCurrency];
            if (rate) {
                let result = (amount * rate).toFixed(2);
                document.getElementById('result').innerHTML = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
            } else {
                document.getElementById('result').innerHTML = "Currency conversion rate not available.";
            }
        })
        .catch(error => {
            document.getElementById('result').innerHTML = "Error fetching exchange rate.";
            console.error('Error:', error);
        });
});
