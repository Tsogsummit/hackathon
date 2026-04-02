#include <bits/stdc++.h>

using namespace std;

int main() {
    int i, j, n;
    set<int> S;
    set<int> :: iterator it;
    /*set<int> int ni turliin zaaj bgaa yum intiin orond string,char,long long geh met turluu uuruu zaaj ugch bolno*/
    scanf("%d" , &n);
    for(i = 1 ; i <= n ; i++){
        int x;
        scanf("%d" , &x);
        /*set ruu utga nemeh*/
        S.insert(x);
    }
    /* set ni 1 utga 1 l udaaa aguulagdah ba usuhuur erembleh bolno*/
    int sz = S.size(); /*size iin oloh*/
    for(it = S.begin(); it != S.end(); it++){
        int x = *it;
        /*set dotor bgaa utgaa gargaj avah*/
        printf("%d ", x);
    }
    return 0;
}
