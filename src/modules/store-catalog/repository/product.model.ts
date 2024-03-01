import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "products_storage",
    timestamps: false,
})
export default class ProductStorageModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    description: string;

    @Column({ allowNull: false })
    salesPrice: number;
}