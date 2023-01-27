module.exports = (sequelize, dataType) => {
    const transaction = sequelize.define('transaction', {
        userId: {
            type: dataType.INTEGER,
            allowNull: false
        },

        amount: {
            type: dataType.FLOAT,
            allowNull: false
        },

        reference: {
            type: dataType.STRING,
            unique: true,
            allowNull: false
        },

        access_code: {
            type: dataType.STRING,
            allowNull: false
        },

        status: {
            type: dataType.ENUM("incomplete", "success", "failed"),
            defaultValue: "incomplete"
        }
    });

    return transaction;
}