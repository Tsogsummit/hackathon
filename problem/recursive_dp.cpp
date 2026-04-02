//https://www.spoj.com/CSMS/problems/CSMS0084/
#include <bits/stdc++.h>
#define pb push_back

using namespace std;

vector<int> v[100001];
int dp[10001][4] , n;

int solve(int a , int b , int c){
    if(dp[a][b] != -1) return dp[a][b];
    int sum = b;
    for(int i = 0 ; i < v[a].size() ; i++){
        int d = v[a][i];
        if(d != c){
            int ans = 1e9;
            for(int j = 1 ; j <= 3 ; j ++){
                if(j != b) ans= min(ans , solve(d , j , a));
            }
            if(ans != 1e9) sum += ans;
        }
    }
    return dp[a][b] = sum;
}

int main(){
    cin >> n;
    for(int i = 1 ; i < n ; i ++){
        int e , f;
        cin >> e >> f;
        v[e].pb(f);
        v[f].pb(e);
    }
    memset(dp , -1 , sizeof(dp));
    int res = 1e9;
    for(int i = 1 ; i <= 3 ; i++)res = min(res , solve(1 , i , 0));
    cout << res;
}
