export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        // this.load.image('background', 'assets/space.png');
        // this.load.image('logo', 'assets/phaser.png');
        this.load.image('dirtHex', 'assets/tileDirt_tile.png');

        //  The ship sprite is CC0 from https://ansimuz.itch.io - check out his other work!
        // this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });
        // this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });

        this.load.spritesheet('bee', 'assets/bee.png', { frameWidth: 240, frameHeight: 240 });
    }

    // This is a working hard coded version
    // create() {
    //     const tileWidth = 65;
    //     const tileHeight = 89;

    //     const centerX = this.cameras.main.centerX;
    //     const centerY = this.cameras.main.centerY;

    //     // Center hex
    //     this.add.image(centerX, centerY, 'dirtHex');
    //     this.add.image(centerX + 57, centerY, 'dirtHex'); //right
    //     this.add.image(centerX + 28.75, centerY - 42, 'dirtHex'); //top right
    //     this.add.image(centerX - 28.75, centerY - 42, 'dirtHex'); //top left
    //     this.add.image(centerX - 57, centerY, 'dirtHex'); //left
    //     this.add.image(centerX - 28.75, centerY + 42, 'dirtHex'); //bottom left
    //     this.add.image(centerX + 28.75, centerY + 42, 'dirtHex'); //bottom right

    //     offsets.forEach(([dx, dy]) => {
    //         this.add.image(centerX + dx, centerY + dy, 'dirtHex');
    //     });
    // }



    // create() {
    //     const centerX = this.cameras.main.centerX;
    //     const centerY = this.cameras.main.centerY;

    //     this.hive = {
    //         tiles: [],        // store placed tiles
    //         radius: 0,        // how many rings placed
    //         center: { x: centerX, y: centerY }
    //     };


    //     function expandHive() {
    //         const tileWidth = 65;
    //         const tileHeight = 89;
    //         const centerX = this.hive.center.x;
    //         const centerY = this.hive.center.y;

    //         const r = ++this.hive.radius; // increase the ring count

    //         const axialToPixel = (q, r) => {
    //             const x = 57 * q; // manually tuned spacing from before
    //             const y = 42 * r; // vertical spacing
    //             return { x, y };
    //         };

    //         // Generate all coordinates in ring of radius r
    //         const directions = [
    //             [1, 0], [1, -1], [0, -1],
    //             [-1, 0], [-1, 1], [0, 1]
    //         ];

    //         let q = directions[4][0] * r;
    //         let rAxial = directions[4][1] * r;

    //         for (let side = 0; side < 6; side++) {
    //             const [dq, dr] = directions[side];
    //             for (let i = 0; i < r; i++) {
    //                 const { x, y } = axialToPixel(q, rAxial);
    //                 this.hive.tiles.push(this.add.image(centerX + x, centerY + y, 'dirtHex'));
    //                 q += dq;
    //                 rAxial += dr;
    //             }
    //         }
    //         console.log("tiles", this.hive.tiles)
    //     }



    //     this.hive = {
    //         tiles: [],
    //         radius: 0,
    //         center: { x: centerX, y: centerY }
    //     };

    //     // Add center tile
    //     this.hive.tiles.push(this.add.image(centerX, centerY, 'dirtHex'));

    //     // Add button
    //     this.add.text(50, 50, 'Add Hex', {
    //         fontSize: '24px',
    //         fill: '#fff',
    //         backgroundColor: '#333',
    //         padding: { x: 10, y: 5 }
    //     })
    //         .setInteractive()
    //         .on('pointerdown', () => expandHive.call(this));
    // }

    create() {
        const tileWidth = 65;
        const tileHeight = 89;

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        const axialToPixel = (q, r) => {
            const x = tileWidth * 0.75 * q;
            const y = tileHeight * (r + 0.5 * (q & 1));
            return { x, y };
        };

        this.hive = {
            radius: 0,
            center: { x: centerX, y: centerY },
            tileMap: {} // map of 'q,r' => tile
        };

        const revealTile = (q, r) => {
            const key = `${q},${r}`;
            if (this.hive.tileMap[key]) return; // already exists

            const { x, y } = axialToPixel(q, r);
            const screenX = centerX + x;
            const screenY = centerY + y;

            const tile = this.add.image(screenX, screenY, 'dirtHex');
            this.hive.tileMap[key] = tile;
        };

        // 🔹 Reveal center tile
        revealTile(0, 0);

        // 🔹 Expand button
        this.add.text(50, 50, 'Expand Hive', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 10, y: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => {
                this.hive.radius += 1;
                const radius = this.hive.radius;

                // Spiral ring generation
                const directions = [
                    [1, 0], [0, 1], [-1, 1],
                    [-1, 0], [0, -1], [1, -1]
                ];

                let q = directions[4][0] * radius;
                let r = directions[4][1] * radius;

                for (let side = 0; side < 6; side++) {
                    const [dq, dr] = directions[side];
                    for (let i = 0; i < radius; i++) {
                        revealTile(q, r);
                        q += dq;
                        r += dr;
                    }
                }
            });
    }



    // create() {
    //     // this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

    //     // const logo = this.add.image(640, 200, 'logo');
    //     const dirtHex = this.add.image(640, 200, 'dirtHex');
    //     const dirtHex2 = this.add.image(585, 200, 'dirtHex');
    //     const dirtHex3 = this.add.image(612.5, 240, 'dirtHex');

    //     // const ship = this.add.sprite(640, 360, 'ship');
    //     // const ship2 = this.add.sprite(240, 360, 'ship');

    //     this.bee = this.add.sprite(640, 195, 'bee').setScale(0.15);;

    //     // ship.anims.create({
    //     //     key: 'fly',
    //     //     frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 2 }),
    //     //     frameRate: 15,
    //     //     repeat: -1
    //     // });

    //     //         ship2.anims.create({
    //     //     key: 'fly',
    //     //     frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 2 }),
    //     //     frameRate: 15,
    //     //     repeat: -1
    //     // });

    //     this.anims.create({
    //     key: 'flap',
    //     frames: this.anims.generateFrameNumbers('bee', { start: 0, end: 2 }),
    //     frameRate: 10,
    //     repeat: -1
    //     });

    //     // ship.play('fly');
    //     // ship2.play('fly');
    //     this.bee.play('flap');

    //     // this.tweens.add({
    //     //     targets: ship,
    //     //     y: 400,
    //     //     duration: 1500,
    //     //     ease: 'Sine.inOut',
    //     //     yoyo: true,
    //     //     loop: -1
    //     // });

    //     // this.tweens.add({
    //     //     targets: ship2,
    //     //     y: 800,
    //     //     duration: 1200,
    //     //     ease: 'Sine.inOut',
    //     //     yoyo: true,
    //     //     loop: -1
    //     // });

    //     // this.tweens.add({
    //     //     targets: this.bee,
    //     //     y: 640,
    //     //     duration: 1200,
    //     //     ease: 'Sine.inOut',
    //     //     yoyo: true,
    //     //     loop: -1
    //     // });
    // }

    update() {
        // this.background.tilePositionX += 16;
        // bee.x += 1;
        // this.bee.x += 0.1
    }

}
