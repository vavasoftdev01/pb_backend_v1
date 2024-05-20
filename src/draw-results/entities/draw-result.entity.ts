import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'dbo.3M_powerball', synchronize: false})

export class DrawResult {
    @PrimaryGeneratedColumn({})
    idx: number;

    @Column({ nullable: true})
    game: string;

    @Column({ nullable: false})
    id: number;

    @Column({ nullable: true})
    round: number;

    @Column({ nullable: true })
    dt: string;

    @Column({ nullable: true })
    sdate: string;

    @Column({ nullable: true })
    edate: string;

    @Column({ nullable: true })
    pb: string;

    @Column({ nullable: true })
    num1: string;

    @Column({ nullable: true })
    num2: string;

    @Column({ nullable: true })
    num3: string;

    @Column({ nullable: true })
    num4: string;

    @Column({ nullable: true })
    num5: string;

    @Column({ nullable: false })
    num_sum: number;

    @Column({ nullable: true })
    num_sum_sec: string;

    @Column({ nullable: true })
    num_sum_odd: string;

    @Column({ nullable: true })
    pb_odd: string;

    // Date Constraints..
    @CreateDateColumn({ nullable: true, type: 'datetime' })
    regdate: Date;

    @UpdateDateColumn ({ nullable: true, type: 'datetime' })
    modifydate: Date;

    @Column({ nullable: true, type: 'datetime' })
    accountdate: Date;

    @Column({ nullable: true, type: 'datetime' })
    void: Date;
}
