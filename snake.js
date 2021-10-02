let mensagem = document.getElementById("mensagem")
let placar = document.getElementById("placar")
let tela = document.getElementById("tela")
let plano = tela.getContext("2d")
plano.fillStyle = "black"

let movimento = { esquerda: "E", cima: "C", direita: "D", baixo: "B" }
let situacao = { vazio: "v", corpo: "s", comida: "c", parede: "p" }

let cobra
let telinha
let pontuacao
let jogando
let concluido
let time

function criaCobra() {
    return {
        cabeca: { x: 24, y: 24 },
        movimento: movimento.direita,
        corpo: [{ x: 23, y: 24 }]
    }
}

function criaTela() {
    let grid = []
    for (let i = 0; i < 50; i++) {
        grid.push([])
        for (let j = 0; j < 50; j++) {
            if (i == 0 || j == 0 || i == 49 || j == 49) {
                grid[i].push(situacao.parede)
            } else {
                grid[i].push(situacao.vazio)
            }
        }
    }
    return {
        grid,
        start(cobra) {
            this.grid[cobra.cabeca.x][cobra.cabeca.y] = situacao.corpo
            for (let i = 0; i < cobra.corpo.length; i++) {
                this.grid[cobra.corpo[i].x][cobra.corpo[i].y] = situacao.corpo
            }
            this.comida()
        },
        print() {
            for (let i = 0; i < 50; i++) {
                for (let j = 0; j < 50; j++) {
                    if (this.grid[j][i] == situacao.vazio) {
                        plano.clearRect(j * 10, i * 10, 10, 10)
                    } else {
                        plano.fillRect(j * 10, i * 10, 10, 10)
                    }
                }
            }
        },
        comida() {
            let procura = true
            let x
            let y
            while (procura) {
                x = Math.floor(Math.random() * 48) + 1
                y = Math.floor(Math.random() * 48) + 1
                if (this.grid[x][y] == situacao.vazio) {
                    this.grid[x][y] = situacao.comida
                    plano.fillRect(x * 10, y * 10, 10, 10)
                    procura = false
                }
            }
        }
    }
}


function jogar() {
    jogando = false
    cobra = criaCobra()
    telinha = criaTela()
    telinha.start(cobra)
    telinha.print()
    mensagem.innerText = "Use as teclas direcionais para jogar"
    placar.innerText = ""
    time = 100
}

async function inicio() {
    jogando = true
    concluido = true
    pontuacao = 0
    mensagem.innerText = "Pontuação:"
    placar.innerText = pontuacao
    window.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
            case 37:
                move(movimento.esquerda)
                break
            case 38:
                move(movimento.cima)
                break
            case 39:
                move(movimento.direita)
                break
            case 40:
                move(movimento.baixo)
                break
        }
    })
    do {
        await delay(time)
        movimenta()
    } while (jogando)
}

function movimenta() {
    let val = valido()
    let calda
    if (val.is) {
        if (val.quadrado == situacao.comida) {
            cobra.corpo.push({ x: cobra.cabeca.x, y: cobra.cabeca.y })
            cobra.cabeca.x = val.x
            cobra.cabeca.y = val.y
            telinha.grid[val.x][val.y] = situacao.corpo
            telinha.comida()
            pontuacao++
            placar.innerText = pontuacao
            if (pontuacao % 10 == 0) {
                time = Math.floor(time * 0.9)
            }
            concluido = true
        } else {
            cobra.corpo.push({ x: cobra.cabeca.x, y: cobra.cabeca.y })
            calda = cobra.corpo.shift()
            telinha.grid[calda.x][calda.y] = situacao.vazio
            plano.clearRect(calda.x * 10, calda.y * 10, 10, 10)
            cobra.cabeca.x = val.x
            cobra.cabeca.y = val.y
            telinha.grid[val.x][val.y] = situacao.corpo
            plano.fillRect(val.x * 10, val.y * 10, 10, 10)
            concluido = true
        }
    } else {
        jogando = false
        jogar()
    }
}

function valido() {
    let is
    let quadrado
    let x
    let y
    switch (cobra.movimento) {
        case movimento.esquerda:
            x = cobra.cabeca.x - 1
            y = cobra.cabeca.y
            quadrado = telinha.grid[x][y]
            if (quadrado == situacao.vazio || quadrado == situacao.comida) {
                is = true
                return { is, quadrado, x, y }
            } else {
                is = false
                return { is, quadrado, x, y }
            }
        case movimento.cima:
            x = cobra.cabeca.x
            y = cobra.cabeca.y - 1
            quadrado = telinha.grid[x][y]
            if (quadrado == situacao.vazio || quadrado == situacao.comida) {
                is = true
                return { is, quadrado, x, y }
            } else {
                is = false
                return { is, quadrado, x, y }
            }
        case movimento.direita:
            x = cobra.cabeca.x + 1
            y = cobra.cabeca.y
            quadrado = telinha.grid[x][y]
            if (quadrado == situacao.vazio || quadrado == situacao.comida) {
                is = true
                return { is, quadrado, x, y }
            } else {
                is = false
                return { is, quadrado, x, y }
            }
        case movimento.baixo:
            x = cobra.cabeca.x
            y = cobra.cabeca.y + 1
            quadrado = telinha.grid[x][y]
            if (quadrado == situacao.vazio || quadrado == situacao.comida) {
                is = true
                return { is, quadrado, x, y }
            } else {
                is = false
                return { is, quadrado, x, y }
            }
    }
}

function verifica() {
    if (!jogando) {
        inicio()
    }
}

function move(e) {
    if (jogando && concluido) {
        if (cobra.movimento == movimento.esquerda || cobra.movimento == movimento.direita) {
            if (e == movimento.cima || e == movimento.baixo) {
                cobra.movimento = e
                concluido = false
            }
        } else {
            if (e == movimento.esquerda || e == movimento.direita) {
                cobra.movimento = e
                concluido = false
            }
        }
    }
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}