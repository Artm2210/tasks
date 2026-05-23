export function calculate(a: number, b: number, x: number): number {
    return Math.pow(a + b * x, 2.5) / (1 + Math.log10(a + b * x));
}

export function task1(a: number, b: number, xn: number, xk: number, deltax: number) {
    for (let x = xn; x <= xk; x += deltax) {
        console.log(`x = ${x.toFixed(2)}; y = ${calculate(a, b, x).toFixed(4)}`);
    }
}

export function task2(a: number, b: number, arrayx: number[]) {
    for (let i = 0; i < arrayx.length; i++) {
        console.log(`x = ${arrayx[i]}; y = ${calculate(a, b, arrayx[i]).toFixed(4)}`);
    }
}

export function runLab4() {
    console.log("Лабораторная работа №4")
    console.log("Задача A")
    task1(2.5, 4.6, 1.1, 3.6, 0.5)
    console.log("Задача B")
    task2(2.5, 4.6, [1.28, 1.36, 1.46, 2.35])
}