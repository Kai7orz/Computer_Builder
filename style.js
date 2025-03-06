let pcInfo 
let brandList = new Array()


//GPUのブランドのリストを作成する


function start(url,cpuOrGpu){
    let section 
    let optionSelect
    console.log("cpu gpu:",cpuOrGpu)
    if(cpuOrGpu === "gpu" || cpuOrGpu === "Gpu" || cpuOrGpu === "GPU"){
       section = "gpu-select" 
       optionSelect = "gpu-model-select"
    }
    else{
       section = "cpu-select"
       optionSelect = "cpu-model-select"
    }

    fetch(url).then(response=>{
        return response.json()
    }).then(
        answer=>{
            console.log("section ",section)
            let select = document.getElementById(section)
            let num = 0
            pcInfo = answer
            for(ans in answer){
                    let flag = true
                    for( b in brandList){
                        if(brandList[b] == answer[ans].Brand){
                            flag = false
                        }
                    }
                    if(flag == true){                       //Brandのリストを作成 セレクトタグへオプションを追加する
                        brandList.push(answer[ans].Brand)
                        let addOp = document.createElement("option")
    
                        addOp.text = answer[ans].Brand
                        addOp.value = num
                        select.appendChild(addOp)
                        num += 1
                    }
            }

            select.addEventListener("change",(e)=>{        //brandが選択された際の動作
                let idx = e.target.value        
                let modelList 
            
                console.log("idx::",idx)


                modelList = getModel(pcInfo,brandList[idx])     //brandに沿ったmodelリストの取得


            //モデルリストによってModel選択肢の初期化・変更を行う
            let mSelect = document.getElementById(optionSelect)
            let mnum = 0 //modellistようのインデックス割り当ての番号
            //console.log("options-->",mSelect.options)
            //modelの選択肢の初期化
            let iniOptions = mSelect.options
            for(let i=iniOptions.length-1;0<=i;--i){ 
                mSelect.removeChild(iniOptions[i])
            }
                
            for( midx in modelList){
                let addModel = document.createElement("option")
                addModel.text = modelList[midx]
                addModel.value = mnum 
                mSelect.appendChild(addModel)
                mnum += 1
            }
        }
        )
            }
        )
    
}

function getModel(pcInfo,brand){
    let modelList = new Array()
    
    for( pcIdx in pcInfo){
        if(brand == pcInfo[pcIdx].Brand){     //ブランドが指定したもの　and 　modelListに含まれていなければ追加
//            console.log("designated Brand:",brand)
//           console.log("PcInfo Brand:",pcInfo[pcIdx].Brand)
        // モデルがまだmodelListに含まれていない場合のみ追加
        if (!modelList.includes(pcInfo[pcIdx].Model)) {
            modelList.push(pcInfo[pcIdx].Model);
        }
        }
    }

//    console.log(modelList)

    return modelList

}


let cpu_url = "https://api.recursionist.io/builder/computers?type=cpu"
let gpu_url = "https://api.recursionist.io/builder/computers?type=gpu"

const array = []


//start(cpu_url,"CPU")
start(gpu_url,"GPU")
//ブランドを基にしたモデルの取り出し


//モデル名からCPU,memoryの情報を引き出す必要がある
/*
    先に画面を作成する ok
    input タグで値を仮置き ok
    サーバからfetchする
    fetchした値をoptionに表示する
    インプットから得た値を構造体computerに保存
    閾値条件によってベンチマーク値を計算する
    リザルト画面を作成する

    brand入力したら，brandが合致するmodelのみfetchして取得する
*/



