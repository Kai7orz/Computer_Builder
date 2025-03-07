
//GPUのブランドのリストを作成する


async function start(url,componentType){

    //error 処理を加える
    return new Promise(async(resolve,reject)=>{
    let pcInfo 
    let brandList = []
    let section 
    let optionSelect
    let numberOfRam = 0

    if(componentType.toLowerCase() === "gpu"){
       section = "gpu-select" 
       optionSelect = "gpu-model-select"
    }
    else if(componentType.toLowerCase() === "cpu"){
       section = "cpu-select"
       optionSelect = "cpu-model-select"
    }
    else if(componentType.toLowerCase() === "ram"){
        section = "ram-select"
        optionSelect = "ram-model-select"
    }
    else if(componentType.toLowerCase() === "storage"){
        section = "storage-select"
        optionSelect = "storage-model-select"
    }
    else{
        console.log("invalid input")
    }


    if(section == "ram-select"){        // ramの場合 how many 欄を作成
        let ramTag = document.getElementById("number-of-ram")
        
        for(let i=1;i<=6;i++){      
        let numOption = document.createElement("option")
        numOption.text = i
        numOption.value = i
        ramTag.appendChild(numOption)   
        }
    
        ramTag.addEventListener("change",(e)=>{
            numberOfRam = e.target.value
            console.log("number of ram :" ,numberOfRam)
        })
    }

    if(section == "storage-select"){ //storageの場合の設定
        let storageTag = document.getElementById("storage-type")
        let storageType 
        storageTag.addEventListener("change",(e)=>{
            storageType =  e.target.value
        })

        console.log("storageType:",storageType)
        //url += storageType
        url += "hdd"
    
    //pcInfo からssd に該当する容量リストの作成・ブランドリストの作成・上記2つに該当するモデルリストの作成
    
    }

    



    fetch(url).then(response=>{         //fetch で JSON情報取得
        return response.json()
    }).then(
        answer=>{
            console.log("section ",section)
            let select = document.getElementById(section)
            let num = 0
            pcInfo = answer

            if(section == "storage-select"){ //storageに関しては，hdd,ssdの容量に関するリストを作成する必要がある．
                //pcInfo のmodel を空白split して最後の要素を抽出して、それが作成中のリストに含まれていなければ追加していく．



            }


            for(ans in answer){　　//Brandのリストを作成 セレクトタグへオプションを追加する
                    let flag = true
                    for( b in brandList){
                        if(brandList[b] == answer[ans].Brand){
                            flag = false
                        }
                    }
                    if(flag == true){                       
                        brandList.push(answer[ans].Brand)
                        let addOp = document.createElement("option")
    
                        addOp.text = answer[ans].Brand
                        addOp.value = num
                        select.appendChild(addOp)
                        num += 1
                    }
            }

            select.addEventListener("change",(e)=>{        //brandが選択された際の動作(modelの取得)
                let idx = e.target.value        
                let modelList 
            
                //console.log("idx::",idx)


                modelList = getModel(pcInfo,brandList[idx])     //brandに沿ったmodelリストの取得
                //console.log("modellist",modelList)

            //モデルリストによってModel選択肢の初期化・変更を行う
            let mSelect = document.getElementById(optionSelect)
            let mnum = 0 //modellistようのインデックス割り当ての番号
            //console.log("options-->",mSelect.options)
            //modelの選択肢の初期化
            let iniOptions = mSelect.options
            mSelect.innerHTML =""
            for(let i=iniOptions.length-1;0<=i;--i){ 
                mSelect.removeChild(iniOptions[i])
            }
                
            for( midx in modelList){
                let addModel = document.createElement("option")
                addModel.text = modelList[midx]
                addModel.value = modelList[midx] 
                mSelect.appendChild(addModel)
                mnum += 1
            }

            

        }
        )
        //modelが選択されたら，ベンチマークスコアを返すようにする（非同期関数としてこの関数を定義しないといけない？）
        
        let modelSelect = document.getElementById(optionSelect)

        modelSelect.addEventListener("change",(e)=>{
            //pcInfoで一致するmodel名から，benchmark値を取り出す    
        for(i in pcInfo){
                if(pcInfo[i].Model == e.target.value){
                    console.log("component power:",e.target.value," benchmark:",pcInfo[i].Benchmark)
                    resolve(pcInfo[i].Benchmark)
                    //return pcInfo[i].Benchmark
                }
            }        
        }
        )

        
            }
        )
    })
}

function getModel(pcInfo,brand){
    let modelList = new Array()
    
    for( pcIdx in pcInfo){
        if(brand == pcInfo[pcIdx].Brand){     //ブランドが指定したもの　and 　modelListに含まれていなければ追加
            console.log("designated Brand:",brand)
           console.log("PcInfo Brand:",pcInfo[pcIdx].Brand)
        // モデルがまだmodelListに含まれていない場合のみ追加
        if (!modelList.includes(pcInfo[pcIdx].Model)) {
            modelList.push(pcInfo[pcIdx].Model);
        }
        }
    }


    return modelList

}


let cpu_url = "https://api.recursionist.io/builder/computers?type=cpu"
let gpu_url = "https://api.recursionist.io/builder/computers?type=gpu"
let ram_url = "https://api.recursionist.io/builder/computers?type=ram"
let storage_url = "https://api.recursionist.io/builder/computers?type="

const array = []


const cpuValue = async () =>{
    return await start(cpu_url,"CPU");
}

const gpuValue = async () =>{
    return await start(gpu_url,"GPU");
}

const ramValue = async () =>{
    return await start(ram_url,"RAM");
}

const storageValue = async () =>{
    return await start(storage_url,"Storage")
}


(async () =>{
    const results = await Promise.all([cpuValue(),gpuValue(),ramValue(),storageValue()])
    console.log(results)
})();



//start(gpu_url,"GPU")
//ブランドを基にしたモデルの取り出し


//モデル名からCPU,memoryの情報を引き出す必要がある
/*
    先に画面を作成する ok
    input タグで値を仮置き ok
    サーバからfetchする ok
    fetchした値をoptionに表示する ok
    ベンチマーク値を取得する
    インプットから得た値を構造体computerに保存
    閾値条件によってベンチマーク値
    リザルト画面を作成する

    brand入力したら，brandが合致するmodelのみfetchして取得する
*/



