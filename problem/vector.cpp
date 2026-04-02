#include <bits/stdc++.h>

using namespace std;

int main() {
    int i , j , n;
    vector <int> a;
    /*vector<int> int ni turliin zaaj bgaa yum intiin orond string,char,long long geh met turluu uuruu zaaj ugch bolno*/
    scanf("%d" , &n);
    for(i = 1 ; i <= n ; i++){
        int x;
        scanf("%d" , &x);
        /*vector ruu utga nemeh uildel*/
        a.push_back(x);
    }
    /* vector ni massivtai ijilhen ba hemjee zaaj ugdugguigeere ylgaatai*/
    int sz = a.size(); /*size iin oloh*/
    for(i = 0; i < sz; i++){
        /*vectoriin utgiig gargaj avah*/
        printf("%d ", a[i]);
    }
    return 0;
}
