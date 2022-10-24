pragma solidity ^0.5.16;

contract Contract {
    // 事件衰减系数
    int256 delta_rev = 5;

    // 位置验证参数
    int256 theta_s = 2;
    int256 theta_f = -3;

    //位置验证系数*100
    int256 sigma1 = 8;
    //主观评价系数
    int256 sigma2 = 92;

    struct user {
        string uuid;
        int256 num;
        uint256 status;
        mapping(int256 => int256) time;
        int256 credit;
        //位置验证
        int256 dquality;
        // Validation
        int256 validNum;
        // rate*100
        int256 successValid;
        int256 failValid;
        // Message
        int256 interval;
        //接单率
        int256 takeNum;
        int256 rejectNum;
        int256 totalNum;
        int256 gamma;
        //主观评价；
        int256 tmpCount;
        int256 lowCount;
    }

    user tempuser;

    mapping(string => user) users;

    function initUser(string memory uuid, int256 lastTime) public {
        users[uuid].credit = 50;
        users[uuid].num = 0;
        users[uuid].status = 1;

        users[uuid].dquality = 0;

        users[uuid].validNum = 0;
        users[uuid].successValid = 0;
        users[uuid].failValid = 0;

        users[uuid].time[0] = lastTime;

        users[uuid].takeNum = 0;
        users[uuid].rejectNum = 0;
        users[uuid].totalNum = 0;
        users[uuid].gamma = 1;
        users[uuid].tmpCount = 0;
        users[uuid].lowCount = 0;
    }

    function divide(int256 dividee, int256 divider)
        public
        pure
        returns (int256)
    {
        int256 round = divider / 2;
        int256 remain = dividee % divider;
        if (remain >= round) {
            return dividee / divider + 1;
        } else {
            return dividee / divider;
        }
    }

    function revalueByValidation(
        string memory uuid,
        int256 time,
        bool result,
        bool isTest
    ) public {
        int256 dquality = 0;

        int256 num = users[uuid].num + 1;
        users[uuid].num = num;

        // time
        users[uuid].time[num] = time;
        int256 lastTime = users[uuid].time[num - 1];
        int256 interval;
        if (isTest == true) {
            interval = time - lastTime;
        } else {
            interval = time - lastTime + 3;
        }
        users[uuid].interval = interval;

        // result
        int256 validNum = users[uuid].validNum;
        if (validNum == 0) {
            users[uuid].validNum = 1;
            if (result == true) {
                users[uuid].successValid = 100;
                dquality = theta_s * 200;
            } else {
                users[uuid].failValid = 100;
                dquality = theta_f * 200;
            }
        } else {
            if (result == true) {
                int256 successValid = users[uuid].successValid;
                successValid = divide(
                    successValid * validNum + 100,
                    validNum + 1
                );
                //successValid = (successValid*validNum + 100) / (validNum + 1);
                dquality =
                    theta_s *
                    (successValid + 100) +
                    theta_f *
                    users[uuid].failValid;
                users[uuid].successValid = successValid;
            } else {
                int256 failValid = users[uuid].failValid;
                failValid = divide(failValid * validNum + 100, validNum + 1);
                //failValid = (failValid*validNum + 100) / (validNum + 1);
                dquality =
                    theta_s *
                    users[uuid].successValid +
                    theta_f *
                    (failValid + 100);
                users[uuid].failValid = failValid;
            }
            validNum = validNum + 1;
            users[uuid].validNum = validNum;
        }
        dquality = delta_rev * dquality;
        dquality = divide(dquality, 100 * interval);
        users[uuid].dquality = dquality;
        users[uuid].credit =
            users[uuid].credit +
            divide(sigma1 * dquality, 100);
        if (users[uuid].credit >= 100) users[uuid].credit = 100;
        if (users[uuid].credit <= 0) users[uuid].credit = 0;
    }

    function clear(string memory uuid) public {
        if (users[uuid].status == 1) {
            users[uuid].validNum = 0;
            users[uuid].successValid = 0;
            users[uuid].failValid = 0;

            users[uuid].takeNum = 0;
            users[uuid].rejectNum = 0;
            users[uuid].totalNum = 0;
        }
    }

    function getCredit(string memory uuid) public view returns (int256) {
        if (users[uuid].status == 0) {
            return 0;
        } else {
            return users[uuid].credit;
        }
    }

    function getInterval(string memory uuid)
        public
        view
        returns (
            int256,
            int256,
            int256,
            int256
        )
    {
        if (users[uuid].status == 0) {
            return (-1, -1, -1, -1);
        }
        return (
            users[uuid].interval,
            users[uuid].validNum,
            users[uuid].successValid,
            users[uuid].failValid
        );
    }

    function getOrder(string memory uuid)
        public
        view
        returns (
            int256,
            int256,
            int256,
            int256
        )
    {
        if (users[uuid].status == 0) {
            return (-1, -1, -1, -1);
        } else {
            return (
                users[uuid].totalNum,
                users[uuid].takeNum,
                users[uuid].rejectNum,
                users[uuid].gamma
            );
        }
    }

    function revalueByOrder(string memory uuid, bool result) public {
        if (result == true) {
            int256 takeNum = users[uuid].takeNum;
            takeNum = takeNum + 1;
            users[uuid].takeNum = takeNum;
        } else {
            int256 rejectNum = users[uuid].rejectNum;
            rejectNum = rejectNum + 1;
            users[uuid].rejectNum = rejectNum;
        }
        users[uuid].totalNum = users[uuid].totalNum + 1;
        users[uuid].gamma = divide(
            users[uuid].takeNum * 100,
            users[uuid].totalNum
        );
    }

    function revalueByEvaluate(string memory uuid, int256 I) public {
        users[uuid].tmpCount = users[uuid].tmpCount + 1;
        if (I < 0) {
            users[uuid].lowCount = users[uuid].lowCount + 1;
        }
        if (divide(users[uuid].lowCount * 10, users[uuid].tmpCount) < 7) {
            users[uuid].tmpCount = 0;
            users[uuid].lowCount = 0;
        } else {
            if (I < 0) I = I * users[uuid].lowCount;
        }
        int256 gamma = users[uuid].gamma;
        int256 devaluation = divide(gamma * I, 100);
       
        users[uuid].credit =
            users[uuid].credit +
            divide(sigma2 * devaluation, 100);
        if (users[uuid].credit >= 100) users[uuid].credit = 100;
        if (users[uuid].credit <= 0) users[uuid].credit = 0;
    }
}
