import mongoose = require('mongoose');

export default class CommonBusiness<T extends mongoose.Document> {
    private _model: mongoose.Model<mongoose.Document>;

    /**
     * Creates an instance of CommonBusiness.
     * 
     * @param {mongoose.Model<mongoose.Document>} schemaModel
     */
    constructor(schemaModel: mongoose.Model<mongoose.Document>) {
        this._model = schemaModel;
    }

    /**
     * 추가 
     * 
     * @param {T} item
     * @param {(error: any, result: any) => void} callback
     */
    create(item: T, callback: (error: any, result: any) => void) {
        this._model.create(item, callback);
    }

    /**
     * 갱신
     * 
     * @param {mongoose.Types.ObjectId} _id
     * @param {T} item
     * @param {(error: any, result: any) => void} callback
     */
    update(_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
        this._model.update({ _id: _id }, item, callback);
    }

    /**
     * 삭제 
     * 
     * @param {string} _id
     * @param {(error: any, result: any) => void} callback
     */
    delete(_id: string, callback: (error: any, result: any) => void) {
        this._model.remove({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
    }

    /**
     * 모든 객체 검색 
     * 
     * @param {(error: any, result: any) => void} callback
     */
    findAll(callback: (error: any, result: any) => void) {
        this._model.find({}, callback);
    }

    /**
     * 검색
     * 
     * @param {string} _id
     * @param {(error: any, result: T) => void} callback
     */
    findById(_id: string, callback: (error: any, result: T) => void) {
        this._model.findById(_id, callback);
    }

    /**
     * ObjectId로 변환
     * 
     * @private
     * @param {string} _id
     * @returns {mongoose.Types.ObjectId}
     */
    private toObjectId(_id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(_id)
    }
}