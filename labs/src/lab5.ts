export class Ship {
    private name: string;
    private length: number;
    private displacement: number;

    constructor(name: string, length: number, displacement: number) {
        this.name = name;
        this.length = length;
        this.displacement = displacement;
    }

    public getLength(): number {
        return this.length;
    }

    public setLength(length: number): void {
        this.length = length;
    }

    public getDisplacement(): number {
        return this.displacement;
    }

    public setDisplacement(displacement: number): void {
        this.displacement = displacement;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }
}

function NewShip(name: string, length: number, displacement: number): Ship {
    return new Ship(name, length, displacement);
}

export function runLab5() {
    console.log("Лабораторная работа №5")
    const myShip = NewShip("Титаник", 269, 52310);

    console.log(myShip.getName());
    console.log(myShip.getLength());
    console.log(myShip.getDisplacement());

    myShip.setLength(275);
    myShip.setDisplacement(53000);
    myShip.setName("Аврора");

    console.log(myShip.getLength());
    console.log(myShip.getDisplacement());
    console.log(myShip.getName());
}