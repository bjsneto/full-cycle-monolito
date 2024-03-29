import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InvoiceItemsModel } from "./invoice-items.model";

@Table({
    tableName: 'invoice',
    timestamps: false
})
export class InvoiceModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string

    @Column({ allowNull: false })
    name: string

    @Column({ allowNull: false })
    document: string

    @Column({ allowNull: true })
    street: string

    @Column({ allowNull: true })
    number: string

    @Column({ allowNull: true })
    complement: string

    @Column({ allowNull: true })
    city: string

    @Column({ allowNull: true })
    state: string

    @Column({ allowNull: true })
    zipCode: string

    @HasMany(() => InvoiceItemsModel)
    items: Awaited<InvoiceItemsModel[]>

    @Column({ allowNull: false })
    createdAt: Date

    @Column({ allowNull: false })
    updatedAt: Date
}