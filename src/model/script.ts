import { db, Model } from '@App/pkg/model';

export type SCRIPT_TYPE = 1 | 2;
export type SCRIPT_STATUS = 1 | 2 | 3;

export interface Script {
    id: number;
    //script name
    name: string;
    //script code
    code: string;
    //script metadata
    metadata: { [key: string]: string[] };
    //script type. 1:normal 2:crontab
    type: SCRIPT_TYPE;
    //script status. 1:enable 2:disable 3:error
    status: SCRIPT_STATUS;
    //script error info
    error: string;
    //script install timestamp
    createtime: number;
    //script update timestamp
    updatetime: number;
    //last check update timestamp
    checktime: number;
}

db.version(1).stores({
    script: "++id,&name,code,metadata,type,status,error,createtime,updatetime,checktime"
});

export const SCRIPT_TYPE_NORMAL = 1;
export const SCRIPT_TYPE_CRONTAB = 2;

export const SCRIPT_STATUS_ENABLE = 1;
export const SCRIPT_STATUS_DISABLE = 2;
export const SCRIPT_STATUS_ERROR = 3;

export class ScriptModel extends Model<Script> {

    protected tableName: string = "scripts";
    public findByName(name: string) {
        return this.findOne({ name: name });
    }

}
