#include <bits/stdc++.h>

using namespace std;

int a[300001] , b[300001] , c[300001] , n , i , m;

int main(){
    scanf("%d%d" , &n , &m);
    for(i = 1 ; i <= m ; i++){
        scanf("%d%d" , &b[i] , &c[i]);
        a[b[i]]++;
        a[c[i]]++;
    }
    for(i = 1 ; i <= n ; i++){
        
    }
}
