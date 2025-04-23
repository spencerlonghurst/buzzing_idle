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
        const tileWidth = 56;   // match your asset size
        const tileHeight = 55;  // adjust to your hex's height
        const worldCenterX = 2500; // Half of your setBounds width
        const worldCenterY = 2500; // Half of your setBounds height

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        const axialToPixel = (q, r) => {
            const x = tileWidth * (q + r / 2);
            const y = tileHeight * r * 0.75;
            return { x, y };
        };

        this.hive = {
            radius: 0,
            center: { x: worldCenterX, y: worldCenterY },
            tileMap: {}
        };

        const revealTile = (q, r) => {
            const key = `${q},${r}`;
            if (this.hive.tileMap[key]) return;

            const { x, y } = axialToPixel(q, r);
            const worldX = this.hive.center.x + x;
            const worldY = this.hive.center.y + y;

            const tile = this.add.image(worldX, worldY, 'dirtHex');
            this.hive.tileMap[key] = tile;
        };


        // Place center tile
        revealTile(0, 0);

        // Add expand button
        this.add.text(50, 50, 'Expand Hive', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#444',
            padding: { x: 10, y: 6 }
        })
            .setScrollFactor(0)
            .setInteractive()
            .on('pointerdown', () => {
                this.hive.radius += 1;
                const radius = this.hive.radius;

                const directions = [
                    [1, 0], [1, -1], [0, -1],
                    [-1, 0], [-1, 1], [0, 1]
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

                const padding = 200;
                const mapRadiusPx = tileWidth * (this.hive.radius + 1);

                // this.cameras.main.setBounds(
                //     centerX - mapRadiusPx - padding,
                //     centerY - mapRadiusPx - padding,
                //     mapRadiusPx * 2 + padding * 2,
                //     mapRadiusPx * 2 + padding * 2
                // );

            });

        this.cameras.main.setBounds(0, 0, 5000, 5000); // start big
        this.input.keyboard.createCursorKeys();

        this.cameras.main.scrollX = worldCenterX - this.cameras.main.width / 2;
        this.cameras.main.scrollY = worldCenterY - this.cameras.main.height / 2;


        this.input.on('pointerdown', (pointer) => {
            this.input.dragStartX = pointer.x;
            this.input.dragStartY = pointer.y;
        });

        this.input.on('pointermove', (pointer) => {
            if (!pointer.isDown) return;

            const dragX = pointer.x - this.input.dragStartX;
            const dragY = pointer.y - this.input.dragStartY;

            this.cameras.main.scrollX -= dragX;
            this.cameras.main.scrollY -= dragY;

            this.input.dragStartX = pointer.x;
            this.input.dragStartY = pointer.y;
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

        const cursors = this.input.keyboard.createCursorKeys();
        const cam = this.cameras.main;

        const speed = 10;
        if (cursors.left.isDown) cam.scrollX -= speed;
        if (cursors.right.isDown) cam.scrollX += speed;
        if (cursors.up.isDown) cam.scrollY -= speed;
        if (cursors.down.isDown) cam.scrollY += speed;

    }

}
