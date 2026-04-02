//https://www.spoj.com/CSMS/problems/ULS11104/
#include <bits/stdc++.h>

using namespace std;

int t , n , m , i , j , l , a[10001] , b[10001];
int dp[20005];

int main() {
    scanf("%d",&t);
    while(t--)
    {
        memset(dp , 0 , sizeof(dp));
        scanf("%d",&n);
        for(i = 1 ; i <= n ; i ++) scanf("%d",&a[i]);
        scanf("%d",&m);
        for(i = 1 ; i <= m ; i ++) scanf("%d",&b[i]);
        for(i = 1 ; i <= n ; i ++){
            for(j = 1 ; j <= m ; j++){
                dp[i + j] += a[i] * b[j];
            }
        }
        int p = 0;
        for(i = m + n ; i >= 2 ; i--){
            dp[i] += p;
            p = dp[i] / 10;
            dp[i] %= 10;
        }
        if(p != 0) printf("%d\n",p);
        for(i = 2 ; i <= n + m ; i ++) printf("%d\n",dp[i]);
    }
    return 0;
}
