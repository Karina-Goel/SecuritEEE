//set up firebase link
const firebaseConfig = {
  apiKey: 'AIzaSyCFAmgTBXFdPRNXx0pyNDoG_6FdBRkVArA',
  databaseURL: 'https://estest-f7bb6-default-rtdb.firebaseio.com/',
  projectId: 'estest-f7bb6',
}
//chart in js
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const initChart = (chartId, label, data) => {
  const ctx = document.getElementById(chartId).getContext('2d')
  new Chart(ctx, {
    zoomEnabled: true,
    type: 'bar',
    data: {
      labels: daysOfWeek,
      datasets: [
        {
          label,
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  })
}
//configure firebase
firebase.initializeApp(firebaseConfig)
const db = firebase.database()
//extract data from firebase
const _getDataFromSensor = (sensorNumber) => //define function with one input sensor number
  db
    .ref() //refer to databse node
    .child(`Sensor${sensorNumber}`) //specifies node
    .get() //fetch data
    .then((snapshot) =>  //snapshot is "capturing" data from firebase
      Object.values(snapshot.val()).map((val) => ({ //convert data in form to use in array for chart
        day: new Date(val.time * 1000).getDay(), //extract day of the week from the value of time sent in by sensor
      }))
    )

const _getForDay = (arr, dayNr) => arr.filter((val) => val.day === dayNr).length //store day in array with number and the day number
const _getForAllDays = (arr) => daysOfWeek.map((_, i) => _getForDay(arr, i)) //do this for all days of the week



const sensor1Action = async () => {
  const isSensor1Active = (await db.ref('Sensor1').get())?.val()
  console.log((await db.ref('Sensor1').get()).val())

  if(isSensor1Active){ //can also try await db.ref().child('Sensor1'))!==null
    alert("OBJECT MISSING! ALARM ACTIVATED");
    var sensor1Ref = firebase.database().ref('Sensor1')
    sensor1Ref.remove()
  }
}

;(async () => {

  ;['Sensor1', 'Sensor2', 'Sensor3'].map((sensor) => {

    sensor1Action()
    db.ref(sensor).on('value', async (snapshot) => {
      console.log('new val')
      initChart('sensor2', 'Number of Times Touched', _getForAllDays(await _getDataFromSensor(2))); //apply function on sensor 1 data and create chart
      initChart('sensor3', 'Number of People Close', _getForAllDays(await _getDataFromSensor(3))); //apply function on sensor 1 data and create chart
    })
  })

  setInterval(() => {
    sensor1Action()
  }, 2000)



})()
