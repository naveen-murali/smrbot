// temp data.
const tempData = [
    {
        "_id": "608aacfffd1fe10c504c0de4", "otp": "578031", "name": "naveen", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T12:56:31.891Z", "__v": 0, "exitTime": "2021-04-29T13:03:04.366Z"
    },
    {
        "_id": "608aad22fd1fe10c504c0de5", "otp": "566833", "name": "pranav", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T12:57:06.416Z", "__v": 0, "exitTime": "2021-04-29T13:02:51.350Z"
    },
    {
        "_id": "608aad45fd1fe10c504c0de6", "otp": "721417", "name": "rohith", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T12:57:41.235Z", "__v": 0, "exitTime": "2021-04-29T13:02:40.091Z"
    },
    {
        "_id": "608aad5bfd1fe10c504c0de7", "otp": "307085", "name": "jijo", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T12:58:03.138Z", "__v": 0, "exitTime": "2021-04-29T13:02:03.306Z"
    },
    {
        "_id": "608aad75fd1fe10c504c0de8", "otp": "137722", "name": "nijith", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T12:58:29.731Z", "__v": 0, "exitTime": "2021-04-29T13:01:48.700Z"
    },
    {
        "_id": "608aad8afd1fe10c504c0de9", "otp": "071125", "name": "vineetha", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T12:58:50.504Z", "__v": 0, "exitTime": "2021-04-29T13:00:38.436Z"
    },
    {
        "_id": "608abe889a1b134c84caa8ee", "otp": "868513", "name": "rahul", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T14:11:20.306Z", "__v": 0, "exitTime": "2021-04-29T14:11:35.955Z"
    },
    {
        "_id": "608acbcd4003e728646b6e5d", "otp": "014765", "name": "sanoop", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T15:07:57.893Z", "__v": 0, "exitTime": "2021-04-29T15:13:26.726Z"
    },
    {
        "_id": "608acc964003e728646b6e5e", "otp": "340263", "name": "anoop", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T15:11:18.517Z", "__v": 0, "exitTime": "2021-04-29T15:16:06.092Z"
    },
    {
        "_id": "608acce74003e728646b6e5f", "otp": "651831", "name": "sachin", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T15:12:39.124Z", "__v": 0, "exitTime": "2021-04-29T15:15:26.546Z"
    },
    {
        "_id": "608acd424003e728646b6e60", "otp": "535087", "name": "arjun", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T15:14:10.113Z", "__v": 0, "exitTime": "2021-04-29T15:16:55.886Z"
    },
    {
        "_id": "609242b7498f6e5dd02851dd", "otp": "051485", "name": "naveen murali", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-05-05T07:01:11.608Z", "__v": 0, "exitTime": "2021-05-05T07:01:21.715Z"
    }
];
// table body
const tBody = document.querySelector('#tableBody');
let tableContent = '';
tempData.map((data) => {
    tableContent += `
    <tr class="table-rows">
        <td>
            <div data-id='${data._id}' class="checkbox">
                <span class="material-icons">check</span>
            </div>
        </td>
        <td class="tName">${data.name}</td>
        <td class="tPhone">${data.phone}</td>
        <td class="tTime">
            entry time : ${data.entryTime} 
            <br>
            exit time : ${data.exitTime}
        </td>
        <td class="tPlace">${data.place}</td>
        <td class="txt-center tOption">
            <a href="#">filter</a>
        </td>
    </tr>`;
});
tBody.innerHTML = tableContent;


const tableRows = document.querySelectorAll(".table-rows");
const tName = document.querySelectorAll(".table-rows > .tName");

tableRows.forEach((row, b) => {
    console.log(tName[b].textContent, row);
    if (tName[b].textContent === "naveen") {
        console.log("here");
        tBody.insertBefore(row, tableRows[b+1]);
    }
})
