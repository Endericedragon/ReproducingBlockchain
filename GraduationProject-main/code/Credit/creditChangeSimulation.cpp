#include <iostream>
#include <map>
#include<pthread.h>
#include<unistd.h>
#include<cmath>
#include<fstream>
#include<string>
#include<time.h>
using namespace std;

#define TOTAL 20000
#define TOTAL_ver 200
#define TOTAL_eva  40
#define TIME_res 100
#define TIME_ver 10000
#define TIME_eva 200000

/**
 * Credit contract content
 */

// 事件衰减系数
int delta_rev = 5;

// 位置验证参数
int theta_s = 2;
int theta_f = -3;

//位置验证系数*100
int sigma1 = 0;
//主观评价系数
int sigma2 = 100;

struct user
{
  string uuid;
  int num;
  int status;
  map<int, int> time;

  int credit;

  //位置验证
  int dquality;
  // Validation
  int validNum;
  // rate*100
  int successValid;
  int failValid;
  // Message
  int interval;

  //接单率
  int takeNum;
  int rejectNum;
  int totalNum;
  int gamma;

  //主观评价；
  int tmpCount;
  int lowCount;
} ;

map<string, user> users;
/**
 * @brief init the user && add the user into users group;
 * 
 * @param uuid   the unique identification of users 
 * @param lastTime  the time of init,analog with number(0,1,2...)
 */
void initUser(string uuid, int lastTime)
{
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
  users[uuid].lowCount=0;
}
/**
 * @brief simulate rounding division
 *
 * @param dividee 
 * @param divider 
 * @return int :result
 */
int divide(int dividee, int divider)  {

    	int round = divider / 2;
    	int remain = dividee % divider;
    	if(remain >= round) {
    		return dividee / divider + 1;
    	}
    	else {
    		return dividee / divider;
    	}
}
/**
 * @brief change the credit by locations verified
 * 
 * @param uuid  the unique identification of users 
 * @param time the time of init,analog with number(0,1,2...)
 * @param result the reult of verification(true or false)
 */
void revalueByValidation(string uuid, int time, bool result){  	

		int dquality = 0;
		
    	int num = users[uuid].num + 1;
      users[uuid].num = num;
		
		// time
		users[uuid].time[num] = time;
		int lastTime = users[uuid].time[num-1];
		int interval;
	
		interval = time - lastTime;

		users[uuid].interval = interval;

		// result
		int validNum = users[uuid].validNum;
		if(validNum == 0) {
			users[uuid].validNum = 1;
			if(result == true) {
				users[uuid].successValid = 100;
				dquality = theta_s * 200;
			}
			else {
				users[uuid].failValid = 100;
				dquality = theta_f * 200;
			}
		}
		else {
			if(result == true) {
				int successValid = users[uuid].successValid;
				successValid = divide(successValid*validNum + 100, validNum + 1);
				//successValid = (successValid*validNum + 100) / (validNum + 1);
				dquality = theta_s * (successValid + 100) + theta_f * users[uuid].failValid;
				users[uuid].successValid = successValid;
			}
			else {
				int failValid = users[uuid].failValid;
				failValid = divide(failValid*validNum + 100, validNum + 1);
				//failValid = (failValid*validNum + 100) / (validNum + 1);
				dquality = theta_s * users[uuid].successValid + theta_f * (failValid + 100);
				users[uuid].failValid = failValid;
			}
			validNum = validNum + 1;
			users[uuid].validNum = validNum;
		}
		dquality = delta_rev * dquality;
		dquality = divide(dquality, 100*interval);
		users[uuid].dquality = dquality;
        users[uuid].credit=users[uuid].credit+divide(sigma1*dquality,100);
		if(users[uuid].credit>=100) users[uuid].credit=100;
        if(users[uuid].credit<=0) users[uuid].credit=0;
}
/**
 * @brief reset  info of user
 * 
 * @param uuid  the unique identification of users 
 */
void  clear(string uuid)  {
    	if(users[uuid].status == 1) {
    		users[uuid].validNum = 0;
    		users[uuid].successValid = 0;
    		users[uuid].failValid = 0;
            users[uuid].takeNum=0;
            users[uuid].rejectNum=0;
            users[uuid].totalNum=0;
    	}
}

/**
 * @brief Get the Credit object
 * 
 * @param uuid 
 * @return int the number of credit(0-100)
 */
int getCredit(string uuid)  {
        if (users[uuid].status == 0) {
            return 0;
        }else{
            return users[uuid].credit;
            
        }
}
/**
 * @brief  get related infos about location verification
 * 
 * @param uuid 
 * @return int* 
 */
int*  getInterval(string  uuid)  {
 int res[4];
        if (users[uuid].status == 0) {
             res[0]=-1;
             res[1]=-1;
             res[2]=-1;
             res[3]=-1;
        }else{
        res[0]=users[uuid].interval;
        res[1]=users[uuid].validNum;
        res[2]= users[uuid].successValid;
        res[3]=users[uuid].failValid;
        }
        int* ptr=res;
        return ptr;
}

/**
 * @brief get related infos about transaction
 * 
 * @param uuid 
 * @return int* 
 */
int* getOrder(string uuid)
    {
     int res[4];
        if (users[uuid].status == 0) {
            res[0]=-1;
             res[1]=-1;
             res[2]=-1;
             res[3]=-1;
        } else{
           res[0]=(users[uuid].totalNum);
          res[1]=(users[uuid].takeNum);
          res[2]=( users[uuid].rejectNum);
          res[3]=(users[uuid].gamma);
        }
       int* ptr=  res;
       return ptr;
}

void revalueByOrder(string  uuid, bool result)  {
        if (result == true) {
            int takeNum = users[uuid].takeNum;
            takeNum = takeNum + 1;
            users[uuid].takeNum = takeNum;
        } else {
            int rejectNum = users[uuid].rejectNum;
            rejectNum = rejectNum + 1;
            users[uuid].rejectNum = rejectNum;
        }
        users[uuid].totalNum = users[uuid].totalNum + 1;
        users[uuid].gamma = divide(
            users[uuid].takeNum * 100,
            users[uuid].totalNum
        );
    }
void  revalueByEvaluate(string  uuid, int I)  {
  users[uuid].tmpCount=users[uuid].tmpCount+1;
      if(I<0) {
        users[uuid].lowCount= users[uuid].lowCount+1;
      }
     if(divide( users[uuid].lowCount*10, users[uuid].tmpCount)<7){
            users[uuid].tmpCount=0;
            users[uuid].lowCount=0;
        }else{
         if(I<0) I=I* users[uuid].lowCount;
        }
    int gamma = users[uuid].gamma;
        int devaluation = divide(gamma * I, 100);
        users[uuid].credit =
            users[uuid].credit +
            divide(sigma2 * devaluation, 100)*2;
        if (users[uuid].credit >= 100) users[uuid].credit = 100;
        if (users[uuid].credit <= 0) users[uuid].credit = 0;
}

/**
 * Test content
 */

/** @brief  influenced by locations verified*/ 
void* valide(void * args){
     ofstream ofs;
     ifstream ifs;
  //init the file
  ofs.open("VerificationResult.json",ios::out);
   ifs.open("VerificationResult_7.json",ios::in);

  ofs<<"[";
  ofs.close();
  //wait to write data...
  ofs.open("VerificationResult.json",ios::app);
  string uuid=*((string *)args);
  int count=1;
  char buffer[5000];
  ifs.getline(buffer,5000);
  while (count<=TOTAL_ver)
  {
    usleep(rand()%TIME_ver);
    bool value=true;
    if(buffer[count*2-1]=='0') value=false;

    // switch (count%10)
    // {
    //   case 0:value=true;      break;
    //   case 1:value=false;      break;
    //   case 2:value=false;      break;
    //   case 3:value=true;      break;
    //   case 4:value=false;      break;
    //   case 5:value=true;      break;
    //   case 6:value=false;      break;
    //   case 7:value=true;      break;
    //   case 8:value=false;      break;
    //   case 9:value=false;      break;
    // default:break;
    // }
    revalueByValidation(uuid,count,value);
    ofs<<value;
    count++;
     if(count<=TOTAL_ver) ofs<<",";
      else ofs<<"]";
  }
  cout<<"finish verification"<<endl;
}

/** @brief  influenced by transaction*/ 
void* evaluate(void * args){
   ofstream ofs;
  //init the file
  ofs.open("EvaluationResult.json",ios::out);
  ofs<<"[";
  ofs.close();
  //wait to write data...
  ofs.open("EvaluationResult.json",ios::app);
  string uuid=*((string *)args);
  int count=1;
  int list_8[]={0,2,2,-2,4,2,2,2,-2,2,4,2,2,2,2,2,-2,-2,2,2,2};
  int list_6[]={0,-2,2,-2,4,-2,2,2,-2,2,4,2,-2,2,2,-2,-2,-2,2,2,2};
  int list_4[]={0,-2,2,-2,4,-2,2,2,-2,-2,-2,2,-2,-2,2,-2,-2,-2,2,2,-2};
  int list_7[]={0,2,2,-2,4,2,2,2,4,2,4,2,2,4,2,2,4,-2,2,2,2,2,2,-2,4,2,2,2,4,2,4,2,2,4,2,2,4,-2,2,2,2};
  while (count<=TOTAL_eva)
  {

    usleep(rand() %TIME_eva);
    if(count%10==11) {revalueByOrder(uuid,false);count++;}
    else{
      cout<<"evaluated"<<endl;
        revalueByOrder(uuid,true);
           int I=list_7[count];
        revalueByEvaluate(uuid,I);
         ofs<<I;
         count++;
       if(count<=TOTAL_eva) ofs<<",";
       else ofs<<"]";
    }
  }
  cout<<"finish transaction"<<endl;
  return NULL;
}

/** @brief write all credit results to file*/ 
void* getResult(void * args){
  ofstream ofs;
  //init the file
  ofs.open("creditResultTest.json",ios::out);
  ofs<<"[";
  ofs.close();
  //wait to write data...
  ofs.open("creditResultTest.json",ios::app);

  string uuid=*((string *)args);
  int count=1;
  while (count<=TOTAL)
  {
    usleep(TIME_res);
    if(count%100==0){
      
      int res=getCredit(uuid);
      cout<<count<<" credit: "<<res<<endl;
     ofs<<"{\"distance\":"+to_string(count)+",\"credit\":"+to_string(res)+"}";
          count++;
    if(count<=TOTAL) ofs<<",";
    else ofs<<"]";
    }else{
    count++;
    }


  }
  ofs.close();
  cout<<"finish writing"<<endl;
    return NULL;

}
int main(){
      string uuid="1";
      initUser(uuid,0);
      pthread_t validation;
       pthread_t evaluation;
       pthread_t result;
   //  pthread_create(&validation,NULL,valide,(void*)&uuid);
      pthread_create(&evaluation,NULL,evaluate,(void*)&uuid);
      pthread_create(&result,NULL,getResult,(void*)&uuid);
      cout<<"finish";
       pthread_exit(NULL);
       return 0;
   }