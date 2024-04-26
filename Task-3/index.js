const URLINPUT = 'https://share.shub.edu.vn/api/intern-test/input';
const URLOUTPUT = 'https://share.shub.edu.vn/api/intern-test/output';

fetch(URLINPUT)
  .then(res => {
    if (!res.ok) {
      throw new Error('Input Error');
    }
    return res.json();
  })
  .then(inputData => {
    const query = inputData.query;
    const data = inputData.data;
    const resultData = [];

    query.forEach(item => {
      const left = item.range[0];
      const right = item.range[1];
      let sum = 0;
      if (item.type === '1') {
        //Tính tổng trong khoảng data[l] + data[l + 1] + data[l + 2] + ... + data[r - 1] + data[r - r]

        for (let i = left; i <= right; i++) {
          sum += data[i];
        }
      } else if (item.type === '2') {
         //Tính tổng trong khoảng data[l] - data[l + 1] + data[l + 2] - data[l + 3] + ... ± data[r - 1] ± data[r]
        for (let i = left; i <= right; i++) {
          if (i % 2 === 0) {
            sum += data[i];
          } else {
            sum -= data[i];
          }
        }
      }
      resultData.push(sum);
    });

    const token = inputData.token;

    return fetch(URLOUTPUT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(resultData),
    });
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Post Error');
    }
    return res.json();
  })
  .then(response => {
    console.log('Post Success:', response);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
