let BenchMarkMap = new Map()
let numberOfRam = 0

function iniOption(){ //空のoption作成して返す
        let iniOption = document.createElement("option")
        iniOption.text = " "
        iniOption.value = " "
        return iniOption
}

function getModel(pcInfo,brand){   //Brandに合致するModelの取得を行なう
    let modelList = new Array()
    
    for( pcIdx in pcInfo){
        if(brand == pcInfo[pcIdx].Brand){     //Brandが指定したものがmodelListに含まれていなければ追加
           
           
           // モデルがまだmodelListに含まれていない場合のみ追加
        if (!modelList.includes(pcInfo[pcIdx].Model)) {
            modelList.push(pcInfo[pcIdx].Model);
        }
        }
    }

    return modelList

}

function calculateScore(weight){

    let i = 0
    let score = 0
    for( let [key,value] of BenchMarkMap){
        if(key=="ram-select"){
            score +=numberOfRam*value*weight[i]
        }
        else{
            score += value*weight[i]
        }
        i+=1   
    }
    return score
}



async function fetchInfo(url,section,optionSelect){

    fetch(url).then(response=>{         //fetch で JSON情報取得
        return response.json()
    }).then(
        pcInfo=>{   

            let select = document.getElementById(section)
            let storageSizeTag = document.getElementById("storage-size")
            let storageBrandTag = document.getElementById("storage-brand")
            let storageModelTag = document.getElementById("storage-model-select")
            let num = 0
            let userStorage  //プルダウンメニューから選択された容量の記録
            let userBrand   //プルダウンメニューから選択されたブランドの記録


            if(section == "storage-select"){ //storageは，hdd,ssdの容量に関するリストを作成する
                storageSizeTag.innerHTML = ""
                storageBrandTag.innerHTML = ""
                storageModelTag.innerHTML  = "" 

                let storageList = new Set()

                for( i in pcInfo){                  //取得したJSONから容量の情報を抽出して，重複なしのリスト(Set)を作成
                   let s = pcInfo[i].Model.split(" ")
                    
                    if(s.at(-1) == "2016)" || s.at(-1)=="2017)"){
                        storageList.add(s.at(-4))
                    }
                    else{
                        storageList.add(s.at(-1))
                    }
                }

                const convertToGB = (size) => { //sortするためのGB変換
                    let num = parseFloat(size)
                    return size.includes("TB") ? num * 1000 : num;
                }
                
                let storageSizes = [...new Set(storageList)]     // ソート処理
                .sort((a, b) => convertToGB(a) - convertToGB(b))
    
                    storageSizeTag.appendChild(iniOption())
                for( idx in storageSizes){                          //storageのプルダウンメニューを作成・追加
                    let pcSize = document.createElement("option")
                    pcSize.text = storageSizes[idx]
                    pcSize.value = storageSizes[idx]
                    storageSizeTag.appendChild(pcSize)
                }


                storageSizeTag.addEventListener("change",(e)=>{               //選択した容量に合致するBrandを抽出する．
                                                                              //Model を 取得したstorage include してるかつ，Brand が合致してるmodel をリスト化する
                    let storageBrandList = new Set()
                    userStorage = e.target.value //ユーザの決定したpc容量を保存する

                    for( i in pcInfo){  //storageSizeに合致したBrandのリストを作成する
                        let storageValue = pcInfo[i].Model.split(" ")
                        if(storageValue.at(-4)==e.target.value){
                            storageBrandList.add(pcInfo[i].Brand)
                        }
                        else if(pcInfo[i].Model.split(" ").at(-1) == e.target.value){
                            storageBrandList.add(pcInfo[i].Brand)
                        }

                }

                    storageBrandTag.appendChild(iniOption())
                    for( brand of storageBrandList){ //Brandのリストを作成 Brand用のプルダウンメニューを追加する
                        let storageBrand = document.createElement("option")
                        storageBrand.text = brand
                        storageBrand.value = brand                        
                        storageBrandTag.appendChild(storageBrand)
                    }
                    
                })

                storageBrandTag.addEventListener("change",(e)=>{ //選択されたstoragesize,brandをもとにmodelを絞る
                    let storageModelList = new Set()
                    userBrand = e.target.value //ユーザの決定したBrand
                    
                    for( idx in pcInfo){

                        let s = pcInfo[idx].Model.split(" ")
                        let targetBrand = pcInfo[idx].Brand
                      
                        if(s.at(-4) == userStorage || s.at(-1) == userStorage){  //容量とブランドが合致していたらリストにmodelを追加していく
                            if(targetBrand == userBrand){
                                storageModelList.add(pcInfo[idx].Model)
                            }
                        }
                    }

                    storageModelTag.appendChild(iniOption())
                    for( model of storageModelList){ //modelのプルダウンメニューの作成
                        let storageModel = document.createElement("option")
                        storageModel.text = model
                        storageModel.value = model    
                        storageModelTag.appendChild(storageModel)
                    }

                            //modelがchangeしたらmap のベンチマーク値変更する
                    storageModelTag.addEventListener("change",(e)=>{
                        for( p in pcInfo){ 
                            if(pcInfo[p].Model == e.target.value){{
                                BenchMarkMap.set(section,pcInfo[p].Benchmark)
                            }}
                        }
                    })
                })
                }  //ここまでがstorage用の処理
            else{   //storage以外は下の処理を利用

                let BrandList = new Set()


                for( i in pcInfo){  //storageSizeに合致したBrandのリストを作成する
                    BrandList.add(pcInfo[i].Brand)
            }

                select.appendChild(iniOption())
                for( brand of BrandList){ //Brandのリストを作成 Brand用のプルダウンメニューを追加する
                    let myBrand = document.createElement("option")
                    myBrand.text = brand
                    myBrand.value = brand                        
                    select.appendChild(myBrand)
                }

            select.addEventListener("change",(e)=>{        //brandが選択された際の動作(modelの取得)
                let brand = e.target.value        
                let modelList 

            modelList = getModel(pcInfo,brand)     //brandに沿ったmodelリストの取得

            //モデルリストによってModel選択肢の初期化・変更を行う
            let mSelect = document.getElementById(optionSelect)

            //modelの選択肢の初期化
            mSelect.innerHTML =""

            //リストが1つしかないとき，選択判定がされなかったので，応急処置として空のoptionをつける
            mSelect.appendChild(iniOption())
            for( midx in modelList){
                let addModel = document.createElement("option")
                addModel.text = modelList[midx]
                addModel.value = modelList[midx] 

                mSelect.appendChild(addModel)
            }
        }
        )
        //modelが選択されたら，ベンチマークスコアを返すようにする        
        let modelSelect = document.getElementById(optionSelect)

        modelSelect.addEventListener("change",(e)=>{
            //pcInfoで一致するmodel名から，benchmark値を取り出す    
        for(i in pcInfo){
                if(pcInfo[i].Model == e.target.value){
                    return (pcInfo[i].Benchmark)
                }
            }        
        }
        )

        modelSelect.addEventListener("change",(e)=>{
            for( p in pcInfo){ 
                if(pcInfo[p].Model == e.target.value){{
                    BenchMarkMap.set(section,pcInfo[p].Benchmark)
                }}
            }
        })
            }
        }
        )

}

async function start(url,componentType){
    //error 処理を加える
    return new Promise(async(resolve,reject)=>{
    
    let section 
    let optionSelect

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
        })
    }

    if(section == "storage-select"){ //storageの場合の設定 storageだけ利用するurlを分岐させる必要があるためif-elseで分けてfetchしている

        let storageTag = document.getElementById("storage-type")
        storageTag.addEventListener("change",(e)=>{
            url = storage_url + e.target.value
            fetchInfo(url,section,optionSelect)        
        })
                
    }else{
        fetchInfo(url,section,optionSelect)
    }

    })
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

let pushButton = document.getElementById("push-button")
pushButton.addEventListener("click",()=>{
    //buttonクリック時にモデルの選択された値を取得する
    
    let cpu = document.getElementById("cpu-model-select")
    let gpu = document.getElementById("gpu-model-select")
    let ram = document.getElementById("ram-model-select")
    let storage = document.getElementById("storage-model-select")

    let gamingWeight = [0.25,0.6,0.125,0.025]   //cpu,gpu,ram,storageの順の重み
    let workWeight = [0.6,0.25,0.1,0.05]
    let gamingScore = calculateScore(gamingWeight) 
    let workScore = calculateScore(workWeight)
    console.log("gamingScore",gamingScore)
    console.log("workScore",workScore)
})
