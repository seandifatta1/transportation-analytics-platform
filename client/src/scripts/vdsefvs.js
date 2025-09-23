
async function blarp(){
    const data = await fetch(
        'http://localhost:1234'
    )
    console.log(data.data)
}

function callBlarp() {

blarp()
}

callBlarp()